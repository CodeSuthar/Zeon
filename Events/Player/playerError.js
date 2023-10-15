const db = require("../../Database/MusicSetup.js");
const { updateQueue } = require("../../Utils/Utils.js");

module.exports = {
    name: "playerError",
    run: async (client, queue, error) => {
        const data = await db.findOne({ _id: queue.guild.id });

        if (data) {
            await updateQueue(client, queue, queue.guild);
        }

        return console.log(`[ Player ] - Error - ${error}`)
    }
}