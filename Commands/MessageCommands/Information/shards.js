const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "shards",
    category: "Information",
    description: "Total Shard Stats",
    aliases: [ "cluster", "shard", "shardinfo" ],
    run: async (message, args, client, prefix) => {
        let m = message.guild.shardId;
        let us = 0 ;
        let ser = 0 ;
        let ch = 0 ;
        let pin = 0;
        let ram = 0;
        let ping = 0;
        let play = 0;
        let c = 0;
        client.shard.broadcastEval(client => [ 
            client.shard.ids, 
            client.guilds.cache.size, 
            client.channels.cache.size, 
            client.guilds.cache.filter((guild) => guild.available).reduce((prev, guild) => prev + guild.memberCount, 0), 
            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), 
            client.ws.ping, 
            client.uptime 
        ]).then((results) => {
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}'s shards`, iconURL: client.user.displayAvatarURL() })
            .setColor("Random")
            .setTimestamp()
            .setDescription(`This server is currently on shard **${message.guild.shardId}**`);
            results.map((data) => {
                c += 1
                ser += data[1]
                ch += data[2]
                us += data[3]
                ram += parseInt(data[4])
                ping += data[5]
                embed.addFields(
                    { name: `${client.emoji.online} Shard ${data[0]}`, value: `\`\`\`js\nServers: ${data[1]}\nChannels: ${data[2]}\nUsers: ${data[3]}\nRam Used: ${data[4]}MB\nPing: ${data[5]}ms\nUptime: ${moment.duration(data[6]).format("D[d] H[h] m[m] s[s]")}\`\`\``, inline: true }
                )
            });
          
            ping = Math.round(ping / c);
            embed.addFields(
                { name: `Total Stats`, value: `\`\`\`js\nTotal Servers: ${ser}\nTotal Channels: ${ch}\nTotal Users: ${us}\nTotal Ram Used: ${ram}\nTotal Avg Ping: ${ping}ms\`\`\`` }
            )
            message.reply({ embeds: [embed] });
        }).catch((error) => {
            console.error(error);
            message.reply(`❌ Error.`);
        });
    }
}