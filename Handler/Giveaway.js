const { EmbedBuilder } = require("discord.js");
const { GiveawaysManager } = require("discord-giveaways");
const { readdirSync } = require("fs");
const giveawayModel = require("../Database/giveaway.js");

module.exports = async (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {

        async getAllGiveaways() {
            return await giveawayModel.find().lean().exec();
        }

    
        async saveGiveaway(messageId, giveawayData) {
            await giveawayModel.create(giveawayData);
            // Don't forget to return something!
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
            return true;
        }

        async deleteGiveaway(messageId) {
            await giveawayModel.deleteOne({ messageId }).exec();
            return true;
        }
    }

    const manager = new GiveawayManagerWithOwnDatabase(client, {
        updateCountdownEvery: 5000,
		default: {
			botsCanWin: false,
			exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
			embedColor: "#8080ff",
			embedColorEnd: "#303236",
			reaction: "🎉"
		},
	});

    client.GiveawayManager = manager;
    
    readdirSync("./Events/Giveaway/").forEach(file => {
        const event = require(`../Events/Giveaway/${file}`);
        console.log(`[ EVENTS ] Giveaway event named ${event.name} loaded`);
        client.GiveawayManager.on(event.name, (...args) => event.run(client, ...args));
    });
}