const { EmbedBuilder } = require('discord.js');
const Premium = require("../../../Database/premium");
const moment = require("moment");

module.exports = {
    name: "premiumstatus",
    category: "Information",
    aliases: ["ps"],
    description: "Checks Your Server Is Premium Or Not?",
    run: async (message, args, client, prefix) => {
        let GuildID = args[0];
        let Guild;

        if (GuildID) {
            Guild = client.guilds.cache.get(GuildId) || client.guilds.fetch(GuildID);
        } else {
            Guild = message.guild;
        } 

        if (!Guild) {
            message.reply(`${client.emoji.wrong} | The guild, You are talking about, I'm not connected to it in anyway.`)
        }

        const Guild2 = await Premium.findOne({ _id: Guild.id });
        
        const embed = new EmbedBuilder()
        .setAuthor({
            name: `${Guild.name} Guild Premium Information`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`Here are the details about your premium status of the server ${Guild.name}.`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor("Random")

        if (!Guild2) {
            embed.addFields([
                { name: `Plan:`, value: `\`\`\`${toOppositeCase("Free")}\`\`\``, inline: true },
                { name: `Expires at:`, value: `\`\`\`Never\`\`\``, inline: true },
                { name: `Features:`, value: `\`\`\`Locked\`\`\``, inline: true },
            ]);
        } else {
            if (Guild2.isPremium) {
                if (Guild2.plan === "lifetime") {
                    embed.addFields([
                        { name: `Plan:`, value: `\`\`\`${toOppositeCase("Premium")}\`\`\``, inline: true },
                        { name: `Expires at:`, value: `\`\`\`Never\`\`\``, inline: true },
                        { name: `Features:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                    ]);
                } else {
                    const timeLeft = moment(Guild2.expireAt).format("dddd, MMMM Do YYYY HH:mm:ss");
                    embed.addFields([
                        { name: `Plan:`, value: `\`\`\`${toOppositeCase("Premium")}\`\`\``, inline: true },
                        { name: `Expires at:`, value: `\`\`\`${timeLeft}\`\`\``, inline: true },
                        { name: `Features:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                    ]);
                }  
            }
        }

        message.reply({ embeds: [embed] })
    }
};

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
};