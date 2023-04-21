const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("sponsor")
    .setDescription("Shows the sponsor of the bot."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setTitle("Sponsor")
        .setDescription(`**[auto.creavite.co](https://auto.creavite.co/) is free graphic generator from templates, made by Hannes. It also has premium templates.**`)
        .setImage(`https://images-ext-2.discordapp.net/external/Hglt-T9jXFKYdZUYWvGND-Mb7A9it2L6U5Uh8QU_uWE/https/auto.creavite.co/og-image.jpg?width=1074&height=561`)
        .setColor("Random")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp()

        const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Visit auto.creavite.co!")
        .setURL("https://auto.creavite.co/")

        const row = new ActionRowBuilder()
        .addComponents(button)

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};