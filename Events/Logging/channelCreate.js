const { EmbedBuilder, ChannelType } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "channelCreate",
    run: async (client, channel) => {
        if (!channel.guild) return;
        if (channel.type === ChannelType.PrivateThread || channel.type === ChannelType.PublicThread || channel.type === ChannelType.AnnouncementThread) return;

        let embed = new EmbedBuilder()
        .setDescription(`**🆕 Channel Created!**`)
        .addFields(
            { name: 'Channel', value: `**${channel.name}**` },
            { name: 'Channel Type', value: `**${CHType(channel.type)}**` },
            { name: 'Channel ID', value: `**${channel.id}**` }
        )
        .setColor("Random")
        .setFooter({ text: `Channel Created At` })
        .setTimestamp();

        return await sendMessage(channel.guild, { embeds: [embed] }, "channelLogs").catch((e) => {
            console.log(e);
        });
    }
};

function CHType(type) {
    let CHType;

    switch (type) {
        case ChannelType.GuildText:
            CHType = 'Text Channel';
            break;
        case ChannelType.GuildVoice:
            CHType = 'Voice Channel';
            break;
        case ChannelType.GuildCategory:
            CHType = 'Category Channel';
            break;
        case ChannelType.GuildAnnouncement:
            CHType = 'Announcement Channel';
            break;
        case ChannelType.GuildStageVoice:
            CHType = 'Stage Channel';
            break;
        default:
            CHType = 'Unknown';
            break;
    }

    return CHType;
};