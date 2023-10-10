const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "emptyQueue",
    run: async (client, queue, track) => {
        const queuedata = queue.metadata;
        const Guild = client.guilds.cache.get(queuedata.guild)
        if (!Guild) return;
        const Channel = Guild.channels.cache.get(queuedata.channel)
        if (!Channel) return;

        const embed = new EmbedBuilder()
        .setDescription("Queue Has Been **Ended**")
        .setTimestamp()
        .setColor("Random")
    
        Channel.send({
            embeds: [embed]
        })
    }
}