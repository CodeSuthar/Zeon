const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("cattext")
    .setDescription("Get a cat text from your simole ones")
    .addStringOption(option => option.setName("text").setDescription("The text to be in the image").setRequired(true)),
    run: async (client, interaction) => {
        const text = interaction.options.getString("text");
        const catText = await client.neko.catText({ text: text });
        return interaction.reply({ content: catText.cat });
    }
};