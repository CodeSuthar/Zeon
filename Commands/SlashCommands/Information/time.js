const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Gives you the current date and time."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setTitle(`${client.emoji.clock} | Current Time and Date`)
        .addFields(
            {name: "Time:", value: `<t:${Math.floor((Date.now()) / 1000)}:T>`, inline: true},
            {name: "Date:", value: `<t:${Math.floor((Date.now()) / 1000)}:D>`, inline: true}
        )
        .setColor("Random")

        return interaction.editReply({
            embeds: [embed]
        });
    }
}