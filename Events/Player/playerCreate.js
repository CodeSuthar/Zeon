const { useMainPlayer } = require("discord-player");
const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Utils/Utils.js");

module.exports = {
    name: "connection",
    run: async (client, queue) => {
        let Player = await useMainPlayer();

        const data = await db.findOne({ _id: queue.guild.id });

        if (data) {
            await updateQueue(client, queue, queue.guild);
        }

        return console.log(`[ Player ] - Joined ${queue.channel.name}(${queue.channel.id}) In ${queue.channel.guild.name}(${queue.channel.guildId}) Guild`)
    }
}