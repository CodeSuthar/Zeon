const { Collection } = require("discord.js");
const Util = require("./Util.js");

module.exports = async (client) => {
    client.commands = new Collection();
    client.aliases = new Collection();
    client.slashCommands = new Collection();
    client.cooldowns = new Collection();
    client.config = require("../config.js");
    client.runfix = client.config.Bot.Prefix;
    client.timertowait = timertowait;
    client.noprefix = client.config.Bot.NoPrefix;
    client.DeveloperId = client.config.Bot.DeveloperId;
    client.emoji = require("../emoji.json");

    client.rest.on('rateLimited', (info) => {
        console.log("[ Rate Limited Log ]" + info);
    });

    //Giveaway Manager
    const GiveawaysManager = require("./Bot-Function-Extended/DiscordGiveaways.js");

    client.giveawayManager = new GiveawaysManager(client, {
        default: {
          botsCanWin: false,
          embedColor: "#a200ff",
          embedColorEnd: "#550485",
          reaction: "🎉",
        }
    });
};

function timertowait(ms) {
    let start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
}