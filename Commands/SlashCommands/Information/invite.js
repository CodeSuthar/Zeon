const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Returns the invite for Zeon!."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setDescription(`Invite Zeon by [clicking here](${client.config.Bot.Invite}) or on the button below`)
        .setColor("Random")

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Invite Zeon!`)
            .setURL(client.config.Bot.Invite)
        )
        
        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};