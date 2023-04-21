const { SlashCommandBuilder } = require("discord.js")
const figlet = require("figlet");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Make your text look very cool in ascii style.")
    .addStringOption((option) => option
        .setName("text")
        .setDescription("The text you want to make ascii.")
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const text = interaction.options.getString("text");
      
        figlet.text(text, {
            font : "",
        }, async (err, data) => {
            interaction.editReply(`\`\`\`${data}\`\`\``)
        })
    },
};