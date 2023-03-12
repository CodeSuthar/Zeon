const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "giveawayReactionRemoved",
    run: async (client, giveaway, member, reaction) => {
        try {
            member.send({
            embeds: [
                    new EmbedBuilder()
                    .setColor("FF0000")
                    .setThumbnail(member.guild.iconURL({dynamic: true}))
                    .setAuthor({ name: `Giveaway Left!`, iconURL: `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128` })
                    .setDescription(`> **You left [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) and aren't participating anymore.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                    .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
                ]
            }).catch(() => {});
                console.log(`${member.user.tag} left giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
            } catch (e) {
                console.log(e);
            }
    }
};