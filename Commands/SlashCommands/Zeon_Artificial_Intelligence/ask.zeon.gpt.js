const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('ask-zeongpt')
    .setDescription('Ask Anything To Zeon AI (Artificial Intelligence)!')
    .addStringOption(option => option.setName('prompt').setDescription('Any Prompt For The Topic You Need To Chat with AI (Artificial Intelligence)!').setRequired(true)),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options } = interaction;
        const prompt = options.getString("prompt")
   
        await interaction.editReply({ content: `${client.emoji.loading} | **${prompt}** - ${interaction.user.toString()} - This Can Take From 30 Second To 5 Minutes, As It is Free` });

        const input = {
            method: `GET`,
            url: `https://google-bard1.p.rapidapi.com/`,
            headers: {
                text: prompt,
                lang: "en",
                psid: "bghdSEoIWN6Rf-h7niygUWj3LBDc3Dx1RwgAUsmtNeTiQCgFPtfia-MiIKc9czYAje6NYQ.", 
                "X-RapidAPI-Key": "9c4f4b0a0emsh47ac8353094529bp14cd6djsn7f662c852aad",
                "X-RapidAPI-Host": "google-bard1.p.rapidapi.com"

            }
        }

        try {
            const options = {
                method: 'GET',
                url: 'https://google-bard1.p.rapidapi.com/',
                headers: {
                  text: prompt,
                  lang: 'en',
                  psid: "bghdSEoIWN6Rf-h7niygUWj3LBDc3Dx1RwgAUsmtNeTiQCgFPtfia-MiIKc9czYAje6NYQ.",
                  'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
                  'X-RapidAPI-Host': 'google-bard1.p.rapidapi.com'
                }
            };
            const output = await axios.request(input);

            const emb = new EmbedBuilder()
            .setColor("Random")
            .setDescription(output.data.response)

            await interaction.editReply({ embeds: [emb] })
        } catch (e) {
            await interaction.editReply(`${client.emoji.loading} | **${prompt}** - ${interaction.user.toString()} - There was an error getting the response from the AI! Try again later.`)
        }
    }
}