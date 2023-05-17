const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Bot } = require(`../../../config.js`);

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("vote")
    .setDescription(`Returns the link to vote for ${Bot.Name}!.`),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setDescription(`Invite ${Bot.Name} by [clicking here](${client.config.BotList.TopGG.LinkToVote}) or on the button below`)
        .setColor("Random")

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Vote ${Bot.Name} on Top.gg!`)
            .setURL(client.config.BotList.TopGG.LinkToVote)
        )
        
        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};