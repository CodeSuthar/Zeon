const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const discordinfo = require("discordinfo.js");
const axios = require("axios");

module.exports = {
    name: "banner",
    category: "Utility",
    description: "Gives you the banner of a specified user or the server",
    usage: "!banner <mention a user>",
    run: async (message, args, client, prefix) => {

        if (args[0] === "help") {
            return help(message, prefix);
        }

        if (args[0] === "server") {
            if (message.guild.banner) {
                let embed = new EmbedBuilder()
                .setTitle(`${message.guild.name}'s Server Banner`)
                .setDescription(`\`Click the button below to download the server icon!\``)
                .setColor(`Random`)
                .setImage(message.guild.bannerURL({size: 4096}))
                .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp()
                const dlbutton = new ButtonBuilder()
                .setLabel(`PNG`)
                .setURL(`${message.guild.bannerURL({ dynamic: true, size: 2048, extension: "png" })}`)
                .setStyle("Link")
            
                const dlbutton2 = new ButtonBuilder()
                .setLabel(`JPG`)
                .setURL(`${message.guild.bannerURL({ dynamic: true, size: 2048, extension: "jpg" })}`)
                .setStyle("Link")
            
                const dlbutton3 = new ButtonBuilder()
                .setLabel(`WEBP`)
                .setURL(`${message.guild.bannerURL({ dynamic: true, size: 2048, extension: "webp" })}`)
                .setStyle("Link")
            
                const row = new ActionRowBuilder()
                .addComponents(dlbutton, dlbutton2, dlbutton3)

                return message.reply({embeds: [embed], components: [row]})
            } else {
                return message.reply(`${client.emoji.wrong} | This server does not have a banner...`)
            }
        }

        if (args[0] === "user") {
            let user = message.mentions.members.first()

            if (!user) {
                if (args[1]) {
                    user = message.guild.members.cache.get(args[1]) || message.guild.members.fetch(args[1]);
                } else {
                    user = message.member;
                }
            }
            
            const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`
                }
            }).then(d => d.data);
            
            if (data.banner) {
                const info = new discordinfo({
                    token: client.config.Bot.Token
                });

                const syt = await info.getUser(user.id);

                let url = syt.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
                url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`;
                const embed = new EmbedBuilder()
                .setColor(`Random`)
                .setDescription(`Banner Of ${user}`)
                .setFooter({ text: `Requested By: ${message.author.tag}` })
                .setImage(url)

                const dlbutton = new ButtonBuilder()
                .setLabel(`PNG`)
                .setURL(`https://cdn.discordapp.com/banners/${user.id}/${data.banner}.png?size=4096`)
                .setStyle("Link")
            
                const dlbutton2 = new ButtonBuilder()
                .setLabel(`JPG`)
                .setURL(`https://cdn.discordapp.com/banners/${user.id}/${data.banner}.jpg?size=4096`)
                .setStyle("Link")
            
                const dlbutton3 = new ButtonBuilder()
                .setLabel(`WEBP`)
                .setURL(`https://cdn.discordapp.com/banners/${user.id}/${data.banner}.webp?size=4096`)
                .setStyle("Link")

                let row = new ActionRowBuilder()
                .addComponents(dlbutton, dlbutton2, dlbutton3)

                if (syt.banner.startsWith(`a_`)) {
                    const dlbutton4 = new ButtonBuilder()
                    .setLabel(`GIF`)
                    .setURL(`https://cdn.discordapp.com/banners/${user.id}/${data.banner}.gif?size=4096`)
                    .setStyle("Link")

                    row = new ActionRowBuilder()
                    .addComponents(dlbutton, dlbutton2, dlbutton3, dlbutton4)
                }

                return message.reply({ embeds:[embed], components: [row] })
            } else {
                return message.reply(`${client.emoji.wrong} | The User Doesn't Have A Banner`)
            }
        }

        return help(message, prefix);
    }
}

function help(msg, prefix) {
    const help = new EmbedBuilder()
    .setTitle(`\`${prefix}banner\``)
    .setDescription(`\`${prefix}banner server\`\nShows banner of the server.\n\n\`${prefix}banner user\`\nShows banner of a user.`)
    .setColor(`Random`)
    .setFooter({ text: `Zeon` })
    .setTimestamp()

    msg.reply({ embeds: [help] })
}