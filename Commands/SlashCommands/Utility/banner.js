const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const discordinfo = require("discordinfo.js");
const axios = require("axios");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Gives you the banner of a specified user or the server.")
    .addSubcommand((subcommand) => subcommand
        .setName("user")
        .setDescription("gives you the banner of a specified user.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("User to get banner of.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("server")
        .setDescription("Gves you the banner of the server.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const args = interaction.options.getSubcommand();

        if (args === "help") {
            return help(message, prefix);
        }

        if (args === "server") {
            if (interaction.guild.banner) {
                let embed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}'s Server Banner`)
                .setDescription(`\`Click the button below to download the server icon!\``)
                .setColor(`Random`)
                .setImage(interaction.guild.bannerURL({size: 4096}))
                .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

                const banner = interaction.guild.bannerURL({ dynamic: true, size: 2048, extension: "gif" })

                const dlbutton = new ButtonBuilder()
                .setLabel(`PNG`)
                .setURL(`${banner.replace("gif", "png")}`)
                .setStyle("Link")
            
                const dlbutton2 = new ButtonBuilder()
                .setLabel(`JPG`)
                .setURL(`${banner.replace("gif", "jpg")}`)
                .setStyle("Link")
            
                const dlbutton3 = new ButtonBuilder()
                .setLabel(`WEBP`)
                .setURL(`${banner.replace("gif", "webp")}`)
                .setStyle("Link")
            
                const row = new ActionRowBuilder()
                .addComponents(dlbutton, dlbutton2, dlbutton3)

                if (banner.startsWith(`https://cdn.discordapp.com/banners/${interaction.guild.id}/a_`)) {
                    const dlbutton4 = new ButtonBuilder()
                    .setLabel(`GIF`)
                    .setURL(banner)
                    .setStyle("Link")
            
                    row = new ActionRowBuilder()
                    .addComponents(dlbutton, dlbutton2, dlbutton3, dlbutton4)
                }

                return interaction.editReply({embeds: [embed], components: [row]})
            } else {
                return interaction.editReply(`${client.emoji.wrong} | This server does not have a banner...`)
            }
        }

        if (args === "user") {
            const user = interaction.options.getUser("user");
            
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
                .setFooter({ text: `Requested By: ${interaction.user.tag}` })
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

                return interaction.editReply({ embeds:[embed], components: [row] })
            } else {
                return interaction.editReply(`${client.emoji.wrong} | The User Doesn't Have A Banner`)
            }
        }
    }
}