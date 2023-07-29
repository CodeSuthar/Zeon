const { ContextMenuCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const moment = require("moment");
const discordinfo = require("discordinfo.js");
const { ApplicationCommandType } = require ('discord-api-types/v9');

module.exports = {
    ContextData: new ContextMenuCommandBuilder()
    .setName('User Avatar')
    .setType(ApplicationCommandType.User),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let mention = interaction.targetMember;
    
        const avatar = mention.displayAvatarURL({ dynamic: true, size: 2048, extension: "png" })
        
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${mention.user.tag}'s Avatar `, iconURL: avatar })
        .setDescription(`\`Click the button below to download!\``)
        .setImage(avatar)
        .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Random")
    
        const link = mention.displayAvatarURL({ dynamic: true, size: 2048, extension: "gif" })
        
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
};