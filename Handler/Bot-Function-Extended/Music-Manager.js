const { Player } = require('discord-player');
const { readdirSync } = require("fs");

//Extend The Player With Features Like Remembering NowPlayingMessage

module.exports = class MusicPlayer extends Player {
    constructor(client) {
        super(client);
        this.client = client;
        this._nowPlayingMessage = new Map();
        this._loadEvents();
    }

    async setNowPlayingMessage(GuildId, Message) {
        this._nowPlayingMessage.set(GuildId, Message);
    }

    async getNowPlayingMessage(GuildId) {
        return this._nowPlayingMessage.get(GuildId);
    }

    _loadEvents() {
        let count = 0;
        const events = readdirSync("./Events/Player/").filter((f) => f.endsWith(".js"));
        if (!events.length) throw new Error(`[ EVENTS ] No player event files found!`);
        events.forEach((eventStr) => {
            const Events = require(`../../Events/Player/${eventStr}`);
            console.log(`[ EVENTS ] Player event named ${eventStr} loaded`);
            this.events.on(Events.name, (...args) => Events.run(this.client, ...args));
            count++;
        });

        console.log(`[ EVENTS ] ${count} Player events loaded.`);
    }
}