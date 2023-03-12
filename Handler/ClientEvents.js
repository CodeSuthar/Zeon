const { readdirSync } = require("fs");

module.exports = async (client) => {
    readdirSync('./Events/').forEach(async (EventFolder) => {
        if (EventFolder != 'Giveaway') {
            const Events = readdirSync(`./Events/${EventFolder}`).filter(file => file.split('.').pop() === 'js');
            Events.forEach(async (EventName) => {
                if (!Events.length) throw Error('No event files found!');
                const Event = require(`../Events/${EventFolder}/${EventName}`);
                console.log(`[ EVENTS ] Client event named ${EventName} loaded`);
                client.on(Event.name, (...args) => Event.run(client, ...args));
            });
        };
    });
};