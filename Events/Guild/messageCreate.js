const { EmbedBuilder, Collection } = require("discord.js");
const dbprefix = require("../../Database/prefix.js");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (!message.guild || !message.channel || !message.id || message.author.bot) return;
        let prefix = client.runfix;
        const channel = message?.channel;
        const ress =  await dbprefix.findOne({ Guild: message.guildId })
        if (ress && ress.Prefix) prefix = ress.Prefix;
        const mentionedtheclient = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mentionedtheclient)) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**Hey It's Me ${client.user.username}, Try Me Using Prefix \`${prefix}\`**`);
            return message.channel.send({embeds: [embed]})
        }
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        let args;
        if (!prefixRegex.test(message.content)) {
            if (!client.noprefix.includes(message.author.id)) {
                return;
            } else {
                args = message.content.trim().split(/ +/);
            }
        } else {
            const [ matchedPrefix ] = message.content.match(prefixRegex);
            args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        }
        const cmd = args.shift().toLowerCase();

        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
    
        if (command) {
            try {
                const db = await client.db.get(`blacklist_${message.author.id}`);

                if (db) {
                    return message.reply({ content: `${client.emoji.wrong} | You Are Blacklisted From Using This Bot` })
                }
                
                if (command.developer && !client.DeveloperId.includes(message.author.id)) {
                    return message.reply({ content: `Im, Not A Fool Bot, Only Owner Can Use This Commands` })
                }

                command.run(message, args, client, prefix);
            } catch (e) {
                console.log(e);
                const embed = new EmbedBuilder()
                .setDescription("There Was An Error Executing The Command, Sorry For The Inconvenience \`<3\`");
                return message.reply({ embeds: [embed] });
            }
        }
    }
};