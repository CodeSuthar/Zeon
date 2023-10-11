const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { use } = require("passport");
const { useMainPlayer } = require("discord-player");

module.exports = {
    name: "playerFinish",
    run: async (client, queue, track) => {
        let Player = await useMainPlayer();

        const queuedata = queue.metadata;
        const Guild = client.guilds.cache.get(queuedata.guild)
        if (!Guild) return;
        const Channel = Guild.channels.cache.get(queuedata.channel)
        if (!Channel) return;

        const Information = await Player.getNowPlayingMessage(Guild.id);
    
        if (Information) {
            await Channel.messages.delete(Information);
        } else {
            return
        }
    }
}