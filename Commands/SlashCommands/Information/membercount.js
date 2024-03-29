const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Gets the member count of the server"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        const embed = new EmbedBuilder()
        .setDescription(`Members`)
        .setDescription(`**Members**\n${interaction.guild.memberCount}`)
        .setColor("Random")
        .setTimestamp()
        interaction.editReply({ embeds: [embed] });
    }
}