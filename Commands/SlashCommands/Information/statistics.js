const { SlashCommandBuilder, EmbedBuilder, version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const si = require('systeminformation');
const { Bot } = require(`../../../config.js`)

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("statistics")
    .setDescription(`Shows the ${Bot.Name}'s statistics.`),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        const duration1 = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const cpu = await si.cpu();
        const about = "🔎";
        let ccount = client.channels.cache.size;
        let scount = client.guilds.cache.size;
        let mcount = 0; 
        client.guilds.cache.forEach((guild) => {
            mcount += guild.memberCount;

        });

        const embed = new EmbedBuilder()
            .setTitle(`${Bot.Name}'s statistics`)
            .setDescription(`**Hey am [${Bot.Name}](${client.config.Dashboard.Information.DOmain}) A cool 😎 and Multifunctional Bot with Awesome Features to enhance your discord with more easier way. Find out what I can do using the buttons below.**
`)
            .setColor("#00008B")
            .addFields(
                {
                  name: `Developer(s)`,
                  value: `[**Rtxeonᴸᴳᴺ**](https://discord.com/users/880675703761272854)`,
                  inline: false,
                },
                {
                  name: `Platform`,
                  value: `\`\`\`ini\n[ ${os.type} ]\n\`\`\`` ,
                  inline: true,
                },
                {
                  name: `Bot latency`,
                  value: `\`\`\`ini\n[ ${Math.round(client.ws.ping)} ms\ ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: "Uptime",
                  value: `\`\`\`ini\n[ ${duration1} ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: "Total servers",
                  value: `\`\`\`ini\n[ ${scount} ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: "Total users",
                  value: `\`\`\`ini\n[ ${mcount} ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: "Total channels",
                  value: `\`\`\`ini\n[ ${ccount} ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: `CPU`,
                  value: `\`\`\`ini\n[ ${os.cpus()[0].speed} MHz ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: `Memory`,
                  value: `\`\`\`ini\n[ ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\ ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: `Discord.js`,
                  value: `\`\`\`ini\n[ v${version} ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: `Node`,
                  value: `\`\`\`ini\n[ ${process.version} ]\n\`\`\``,
                  inline: true,
                },   
              )
          .setFooter({ text: `CodeSource Development 💖`, iconURL: "https://images-ext-1.discordapp.net/external/lzR6jeDYThwRRvQHu6uEvedNACkrFmY8HxleMNfx2r8/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/969558840926437406/9d2c7499963e7b2d409bca59f4a24a60.png?width=558&height=558"})
          .setTimestamp()
        
          interaction.editReply({ embeds: [embed] })
    }
}