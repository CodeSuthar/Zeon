const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Handler/Bot-Function-Extended/Utils.js");

module.exports = {
    name: "playerDestroy",
    run: async (client, queue) => {
        const data = await db.findOne({ _id: queue.guild.id });

        if (data) {
            return await updateQueue(client, queue, queue.guild);
        } else {
            return
        }
    }
};