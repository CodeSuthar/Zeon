const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "endedGiveawayReactionAdded",
    run: async (client, giveaway, member, reaction) => {
        member.send({
            embeds: [new EmbedBuilder().setColor("FF0000").setThumbnail(member.guild.iconURL({dynamic: true})).setAuthor({ name: `Giveaway Ended!`, iconURL: `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128` }).setDescription(`> **The [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has ended, you can't participate anymore!**\n\n> Go back to the Channel: <#${giveaway.channelId}>`).setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
        ]
        }).catch(() => {});
        reaction.users.remove(member.user).catch(() => {});
    }
};