const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, InteractionCollector } = require("discord.js");
const Topgg = require("@top-gg/sdk");
const pdata = require("../../Database/premium.js")

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (!message.guild || !message.channel || !message.id || message.author.bot) return;
        let prefix = client.runfix;
        const mentionedtheclient = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mentionedtheclient)) {
            const data = await client.db.get(`botcommandchannel_${message.guild.id}`);

            if (data) {
                const data2 = await client.db.get(`botcommandchannel_channel_${message.guild.id}`);

                const map = data2.map((go) => `<#${go}>`).join(", ");

                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`**Hey It's Me ${client.user.username}, Try Me Using With Slash Command For More Information, Try \`/help\`. This Guild Has Bot Command Only Channel Enabled, So You Can Use Command In The ${map} Channel Only.**`)

                return message.channel.send({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`**Hey It's Me ${client.user.username}, Try Me Using With Slash Command For More Information, Try \`/help\`.**`)

                return message.channel.send({ embeds: [embed] });
            }
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

        const PGuild = await pdata.findOne({ _id: message.guild.id });
    
        if (command) {
            try {
                const data = await client.db.get(`botcommandchannel_${message.guild.id}`);

                if (data) {
                    const data2 = await client.db.get(`botcommandchannel_channel_${message.guild.id}`);

                    if (message.channel.id !== data2) {
                        const embedpro = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | This guild has configured the Bot System to listen Commands only in <#${data2}> channel. So, To use the bot run commands in <#${data2}> channel.`)
                        .setColor("Random")

                        const msg = await message.reply({ embeds: [embedpro] });

                        client.timertowait(8000)

                        msg.delete();
                    }
                }

                const db = await client.db.get(`blacklist_${message.author.id}`);

                if (db) {
                    return message.reply({ content: `${client.emoji.wrong} | You Are Blacklisted From Using This Bot` })
                }

                if (command.premiumReq) {
                    if (!PGuild) {
                        return await message.replyy({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`The command is premium only, you can purchase premium to override all command restrictions, including vote request command. To buy, contact \`Rtxeon#4726\``)] }).catch(() => { });
                    }
                }
                

                if (command.voteReq) {
                    if (!PGuild) {
                        const topgg = new Topgg.Api(client.config.BotList.TopGG.APIToken);
                        let voted = await topgg.hasVoted(message.author.id);
                        if (!voted && !client.DeveloperId.includes(message.author.id)) {
                            return await message.reply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must vote me on [Top.gg](${client.config.BotList.TopGG.LinkToVote}) to use this command, or you can purchase premium for the server to override all command restrictions. To buy, contact \`Rtxeon#4726\``)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Vote").setStyle(5).setURL(client.config.BotList.TopGG.LinkToVote))] }).catch(() => { });
                        }
                    }
                };

                if (!client.DeveloperId.includes(message.author.id)) {
                    const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`We have moved ${client.config.Bot.Name} Commands From Message Commands And Slash Command To Slash Command Only, Please Use Slash Command To Use This Command. Sorry For The Inconvenience \`<3\``);

                    return message.reply({ embeds: [embed] });
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