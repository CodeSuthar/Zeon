const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("Gives the server icon of the server."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild.name}'s Server Icon`, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setDescription(`\`Click the button below to download the server icon!\``)
        .setColor("Random")
        .setImage(interaction.guild.iconURL({ dynamic: true, size: 2048 }))
        .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()

        const icon = interaction.guild.iconURL({ dynamic: true, size: 2048, extension: "gif" })

        const dlbutton = new ButtonBuilder()
        .setLabel(`PNG`)
        .setURL(`${icon.replace("gif", "png")}`)
        .setStyle("Link")
    
        const dlbutton2 = new ButtonBuilder()
        .setLabel(`JPG`)
        .setURL(`${icon.replace("gif", "jpg")}`)
        .setStyle("Link")
    
        const dlbutton3 = new ButtonBuilder()
        .setLabel(`WEBP`)
        .setURL(`${icon.replace("gif", "webp")}`)
        .setStyle("Link")

        let row = new ActionRowBuilder()
        .addComponents(dlbutton, dlbutton2, dlbutton3)

        if (icon.startsWith(`https://cdn.discordapp.com/icons/${interaction.guild.id}/a_`)) {
            const dlbutton4 = new ButtonBuilder()
            .setLabel(`GIF`)
            .setURL(icon)
            .setStyle("Link")

            row = new ActionRowBuilder()
            .addComponents(dlbutton, dlbutton2, dlbutton3, dlbutton4)
        }

        interaction.editReply({ embeds: [embed], components: [row] })
    }
}