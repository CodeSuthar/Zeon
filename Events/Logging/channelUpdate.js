const { EmbedBuilder, ChannelType } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "channelUpdate",
    run: async (client, oldChannel, newChannel) => {
        if (!oldChannel.guild || !newChannel.guild) return;
        if (oldChannel.type === ChannelType.PrivateThread || oldChannel.type === ChannelType.PublicThread || oldChannel.type === ChannelType.AnnouncementThread) return;
        if (newChannel.type === ChannelType.PrivateThread || newChannel.type === ChannelType.PublicThread || newChannel.type === ChannelType.AnnouncementThread) return;

        let embed = new EmbedBuilder()
        .setDescription(`**🔄️ Channel Updated!**`)
        .addFields(
            { name: 'Old Channel', value: `\`\`\`js\nChannel:- ${oldChannel.name}\nChannel Type:- ${CHType(oldChannel.type)}\nChannel ID:- ${oldChannel.id}\`\`\`` },
            { name: 'New Channel', value: `\`\`\`js\nChannel:- ${newChannel.name}\nChannel Type:- ${CHType(newChannel.type)}\nChannel ID:- ${newChannel.id}\`\`\`` }
        )
        .setColor("Random")
        .setFooter({ text: `Channel Updated At` })
        .setTimestamp();

        return await sendMessage(oldChannel.guild, { embeds: [embed] }, "channelLogs").catch((e) => {
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