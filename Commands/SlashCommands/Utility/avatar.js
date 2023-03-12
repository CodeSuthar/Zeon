const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const discordinfo = require("discordinfo.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gives you the avatar of specified user")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("Give me a user to fetch avatar")
        .setRequired(true)
    ),
    run: async (client, interaction, prefix) => {
        if (!interaction.replied) await interaction.deferReply();

        let mention = interaction.options.getMember("user");

        const avatar = mention.displayAvatarURL({ dynamic: true, size: 2048, format: "png" })
    
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${mention.user.tag}'s Avatar `, iconURL: avatar })
        .setDescription(`\`Click the button below to download!\``)
        .setImage(avatar)
        .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Random")

        const link = mention.displayAvatarURL({ dynamic: true, size: 2048, format: "gif" })
    
        const dlbutton = new ButtonBuilder()
        .setLabel(`PNG`)
        .setURL(`${link.replace("gif", "png")}`)
        .setStyle("Link")
    
        const dlbutton2 = new ButtonBuilder()
        .setLabel(`JPG`)
        .setURL(`${link.replace("gif", "jpg")}`)
        .setStyle("Link")
    
        const dlbutton3 = new ButtonBuilder()
        .setLabel(`WEBP`)
        .setURL(`${link.replace("gif", "webp")}`)
        .setStyle("Link")
    
        let row = new ActionRowBuilder()
        .addComponents(dlbutton, dlbutton2, dlbutton3)

        const info = new discordinfo({
            token: client.config.Bot.Token
        });

        const syt = await info.getUser(mention.id);

        if (syt.avatar.startsWith(`a_`)) {
            const dlbutton4 = new ButtonBuilder()
            .setLabel(`GIF`)
            .setURL(link)
            .setStyle("Link")

            row = new ActionRowBuilder()
            .addComponents(dlbutton, dlbutton2, dlbutton3, dlbutton4)
        }
    
        return interaction.editReply({ embeds: [embed], components: [row] })
    }
}