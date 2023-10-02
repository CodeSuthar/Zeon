const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "giveawayReactionAdded",
    run: async (client, giveaway, member, reaction) => {
        const Embed = new EmbedBuilder()
        .setTitle("Entry Confirmed!")
        .setColor("Random")
        .setDescription(`Your entry for the giveaway __**${giveaway.prize}**__ has been confirmed.\n\nVote Me to get 0.5x extra winning chance.`)
        .setFooter({ text: `By joining the giveaways, you agree in being dmed.` })

        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Jump to the giveaway.')
            .setURL(giveaway.messageURL)
            .setStyle("Link"),
            new ButtonBuilder()
            .setLabel('Vote me!')
            .setURL(client.config.BotList.TopGG.LinkToVote)
            .setStyle("Link")
        )

        return member.send({ embeds: [Embed], components: [Row] }).catch(() => {});
                
    }
};