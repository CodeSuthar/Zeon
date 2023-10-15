const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Utils/Utils.js");

module.exports = {
    name: "audioTrackRemove",
    run: async (client, queue, track) => {
        const data = await db.findOne({ _id: queue.guild.id });

        if (data) {
            return await updateQueue(client, queue, queue.guild);
        } else {
            return
        }
    }
};