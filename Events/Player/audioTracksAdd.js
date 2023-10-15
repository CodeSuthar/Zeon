const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Utils/Utils.js");

module.exports = {
    name: "audioTracksAdd",
    run: async (client, queue, tracks) => {
        const data = await db.findOne({ _id: queue.guild.id });

        if (data) {
            return await updateQueue(client, queue, queue.guild);
        } else {
            return
        }
    }
};