const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("achievement")
    .setDescription("Gives you an minecraft achievement with the text you want!")
    .addStringOption(option => option
        .setName("text")
        .setDescription("The text you want to be in the achievement.")
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()

        const { options } = interaction;

        const text = options.getString("text");

        const img = `https://minecraftskinstealer.com/achievement/1/Got%20Achievement!/${encodeURIComponent(text)}`;
        
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Achievement Unlocked!`)
        .setImage(img)
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        
        await interaction.editReply({ embeds: [embed] });
    }
};