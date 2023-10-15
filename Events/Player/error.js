const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Utils/Utils.js");

module.exports = {
    name: "error",
    run: async (client, queue, error) => {
        const data = await db.findOne({ _id: queue.guild.id });

        if (data) {
            await updateQueue(client, queue, queue.guild);
        }

        return console.log(`[ Music Manager ] - Error - ${error}`)
    }
}