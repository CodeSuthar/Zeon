const { useMainPlayer } = require("discord-player");
const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Handler/Bot-Function-Extended/Utils.js");

module.exports = {
    name: "playerFinish",
    run: async (client, queue, track) => {
        let Player = await useMainPlayer();

        const data = await db.findOne({ _id: queue.guild.id });

        const queuedata = queue.metadata;
        const Guild = client.guilds.cache.get(queuedata.guild)
        if (!Guild) return;
        const Channel = Guild.channels.cache.get(queuedata.channel)
        if (!Channel) return;
        if (data && data.channel && data.channel === Channel.id) {
            console.log("Channel is same")
            return await updateQueue(client, queue, Guild);
        };

        const Information = await Player.getNowPlayingMessage(Guild.id);
    
        if (Information) {
            await updateQueue(client, queue, Guild);
            await Channel.messages.delete(Information);
        } else {
            return
        }
    }
}