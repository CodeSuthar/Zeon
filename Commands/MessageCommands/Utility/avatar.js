const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const discordinfo = require("discordinfo.js");


module.exports = {
    name: "avatar",
    category: "Utility",
    description: "Gives you the avatar of specified user",
    usage: "!avatar <mention a user>",
    run: async (message, args, client, prefix) => {

        let mention = message.mentions.members.first();

        if (!mention) {
            if (args[0]) {
                mention = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            } else {
                mention = message.member;
            }
        }

        const avatar = mention.displayAvatarURL({ dynamic: true, size: 2048 })
    
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${mention.user.tag}'s Avatar `, iconURL: avatar })
        .setDescription(`\`Click the button below to download the avatar!\``)
        .setImage(avatar)
        .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
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
    
        return message.reply({ embeds: [embed], components: [row] })
    }
}