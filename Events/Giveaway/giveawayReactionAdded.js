const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "giveawayReactionAdded",
    run: async (client, giveaway, member, reaction) => {
        try {
            const isNotAllowed = await giveaway.exemptMembers(member);
            if (isNotAllowed) {
                member.send({
                    embeds: [new EmbedBuilder().setColor("FF0000").setThumbnail(member.guild.iconURL({dynamic: true})).setAuthor({ name: `Missing the Requirements`, iconURL: `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128` }).setDescription(`> **Your are not fullfilling the Requirements for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), please make sure to fullfill them!.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`).setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
                ]
            }).catch(() => {});
            reaction.users.remove(member.user).catch(() => {});
            return;
          }
        } catch (e) {
          console.log(e);
        }
    }
};