const { EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Handler/Bot-Function-Extended/Utils.js");

module.exports = {
    name: "emptyQueue",
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
        }

        const embed = new EmbedBuilder()
        .setDescription("Queue Has Been **Ended**")
        .setTimestamp()
        .setColor("Random")
    
        Channel.send({
            embeds: [embed]
        })
        return await updateQueue(client, queue, Guild);
    }
}