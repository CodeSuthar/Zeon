const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Bot } = require(`../../../config.js`)

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("invite")
    .setDescription(`Returns the invite for ${Bot.Name}!.`),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setDescription(`Invite ${Bot.Token} by [clicking here](${client.config.Bot.Invite}) or on the button below`)
        .setColor("Random")

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Invite ${Bot.Token}!`)
            .setURL(client.config.Bot.Invite)
        )
        
        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};