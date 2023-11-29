const { EmbedBuilder } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "channelPinsUpdate",
    run: async (client, channel, time) => {
        if (!channel.guild) return;
        let embed = new EmbedBuilder()
        .setDescription(`**📌 Channel's Pins Updated!**`)
        .addFields(
            { name: 'Channel', value: `**${channel.name}**` },
            { name: 'Channel ID', value: `**${channel.id}**` },
            { name: 'Time', value: `<t:${Math.floor(time/1e3)}:R>` }
        )
        .setColor("Random")
        .setFooter({ text: `Channel's Pins Updated At` })
        .setTimestamp();

        return await sendMessage(channel.guild, { embeds: [embed] }, "channelLogs").catch((e) => {
            console.log(e);
        });
    }
};