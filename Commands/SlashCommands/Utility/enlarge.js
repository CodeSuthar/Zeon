const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require('axios');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('enlarge')
    .setDescription('Makes an emoji bigger.')
    .addStringOption(option => option
        .setName('emoji')
        .setDescription('emoji you want to make bigger.')
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply({ ephemeral: false });
 
        let emoji = interaction.options.getString('emoji')?.trim();
 
        if (emoji.startsWith('<') && emoji.endsWith('>')) {
 
            const id = emoji.match(/\d{15,}/g)[0];
 
            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
 
        if (!emoji.startsWith("http")) {
            return await interaction.editReply({ content: "You can't enlarge default emojis" })
        }
 
        if (!emoji.startsWith("https")) {
            return await interaction.editReply({ content: "You can't enlarge default emojis" })
        }
 
        const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(client.emoji.tick + ' | **Your emoji has been enlarged!**')
        .setImage(emoji)
        .setTimestamp()
        .setFooter({ text: 'Emoji Enlarged', iconURL: interaction.user.displayAvatarURL()})
 
        await interaction.editReply({ embeds: [embed] })
    }
}
