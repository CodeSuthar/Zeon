const { useMainPlayer } = require("discord-player");
const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Utils/Utils.js");

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
            return await updateQueue(client, queue, Guild);
        };

        if (data) {
            await updateQueue(client, queue, Guild);
        }

        const Information = await Player.getNowPlayingMessage(Guild.id);
    
        if (Information) {
            
            await Channel.messages.delete(Information);
        } else {
            return
        }
    }
}