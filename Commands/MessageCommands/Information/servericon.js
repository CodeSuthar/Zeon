const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "servericon",
    category: "Information",
    aliases: ["serverav", "serveravatar", "serverpfp"],
    description: "Gives you the server's icon",
    run: async (message, args, client, prefix) => {

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${message.guild.name}'s Server Icon`, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setDescription(`\`Click the button below to download the server icon!\``)
        .setColor("Random")
        .setImage(message.guild.iconURL({ dynamic: true, size: 2048 }))
        .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()

        const icon = message.guild.iconURL({ dynamic: true, size: 2048, extension: "gif" })

        const dlbutton = new ButtonBuilder()
        .setLabel(`PNG`)
        .setURL(`${icon.replace("gif", "png")}}`)
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

        if (icon.startsWith(`https://cdn.discordapp.com/icons/${message.guild.id}/a_`)) {
            const dlbutton4 = new ButtonBuilder()
            .setLabel(`GIF`)
            .setURL(icon)
            .setStyle("Link")

            row = new ActionRowBuilder()
            .addComponents(dlbutton, dlbutton2, dlbutton3, dlbutton4)
        }

        message.reply({ embeds: [embed], components: [row] })
    }
}