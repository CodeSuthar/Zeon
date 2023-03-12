const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "giveawayRerolled",
    run: async (client, giveaway, winners) => {
        for (const winner of winners) {
            winner.send({
                contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway through a \`reroll\`.`,
                embeds: [new EmbedBuilder().setColor("FF0000").setThumbnail(winner.guild.iconURL({dynamic: true})).setAuthor({ name: `Giveaway Won!`, iconURL: `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128` }).setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`).setFooter({ text: winner.guild.name, iconURL: winner.guild.iconURL({dynamic: true}) })
            ]
            }).catch(() => {});
        }
    }
};