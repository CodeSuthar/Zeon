const { readdirSync } = require("fs");

module.exports = async (client) => {
    let count = 0;
    readdirSync('./Events/').forEach(async (EventFolder) => {
        if (EventFolder != 'Giveaway' && EventFolder != 'Player') {
            const Events = readdirSync(`./Events/${EventFolder}`).filter(file => file.split('.').pop() === 'js');
            Events.forEach(async (EventName) => {
                if (!Events.length) throw Error('[ Events ] No client event files found!');
                const Event = require(`../Events/${EventFolder}/${EventName}`);
                console.log(`[ EVENTS ] Client event named ${EventName} loaded`);
                client.on(Event.name, (...args) => Event.run(client, ...args));
                count++;
            });
        };
    });

    console.log(`[ EVENTS ] ${count} Client events loaded.`);
};