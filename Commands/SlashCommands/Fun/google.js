const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuider, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Search google with a button and ease.")
    .addStringOption((option) => option
        .setName("topic")           
        .setDescription("Topic to search.")           
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const topic = interaction.options.getString("topic").slice().split(" ")
        const search = topic.join("+")
        const row  = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel("Google Search")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://google.com/search?q=${search}`)
        );
    
        const embed = new EmbedBuilder()
        .setTitle("Google Search Tool")
        .setDescription(`Click [here](https://google.com/search?q=${search}) or the button below me to view your google search`)
        .setColor("Random")
        interaction.editReply({ embeds: [embed], components: [row]})
    }
}