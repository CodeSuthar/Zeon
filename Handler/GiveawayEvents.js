const { readdirSync } = require("fs");

module.exports = async (client) => {
    readdirSync('./Events/Giveaway/').forEach(async (EventFolder) => {
            const Events = readdirSync(`./Events/Giveaway/`).filter(file => file.split('.').pop() === 'js');
            Events.forEach(async (EventName) => {
                if (!Events.length) throw Error('No event files found!');
                const Event = require(`../Events/Giveaway/${EventName}`);
                console.log(`[ EVENTS ] Client event named ${EventName} loaded`);
                client.giveawayManager.on(Event.name, (...args) => Event.run(client, ...args));
            });
    });
};