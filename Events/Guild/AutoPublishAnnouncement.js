module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (message.channel.type !== ChannelType.GuildAnnouncement) return;
        if (message.author.bot) return;
 
        const data = await publishschema.findOne({ Guild: message.guild.id });
        if (!data) return;
        if (!data.Channel.includes(message.channel.id)) return;
 
        try {
            message.crosspost();
        } catch (err) {
            return;
        }
    }
}