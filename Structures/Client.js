const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const nekoClient = require("nekos.life");
const PlayerManager = require("./Player.js");
const GiveawayManager = require("./Giveaway.js");

module.exports = class Zeon extends Client {
    constructor() {
        super({
            shards: "auto",
            failIfNotExists: true,
            allowedMentions: {
                parse: [],
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials: [
                Partials.Channel, 
                Partials.Message, 
                Partials.User, 
                Partials.GuildMember
            ]
        });
    }

    _loadDefinitions() {
        this.commands = new Collection();
        this.aliases = new Collection();
        this.slashCommands = new Collection();
        this.cooldowns = new Collection();
        this.config = require("../config.js");
        this.runfix = this.config.Bot.Prefix;
        this.sleep = async (ms) => {
            let start = new Date().getTime();
            let end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        };
        this.noprefix = this.config.Bot.NoPrefix;
        this.DeveloperId = this.config.Bot.DeveloperId;
        this.emoji = require("../emoji.json");
        this.snipes = new Collection();
        this._bans = new Collection();
        this._unbans = new Collection();
        this._kicks = new Collection();
    }

    _loadMusicManager() {
        this.musicManager = new PlayerManager(this);
    }

    _loadNekoClient() {
        this.neko = new nekoClient();
    }

    _loadGiveawayManager() {
        this.giveawayManager = new GiveawayManager(this, {
            default: {
                botsCanWin: false,
                embedColor: "#a200ff",
                embedColorEnd: "#550485",
                reaction: "🎉",
            }
        });
    }

    _loadRestManager() {
        this.rest.on('rateLimited', (info) => {
            console.log("[ Rate Limited Log ]" + info);
        });
    }

    _loadHandler() {
        [ "ClientEvents", "Commands", "SlashAndContextCommands", "ConnectMongo", "HandlingError", "GiveawayEvents", "JoinToCreate" ].forEach((Handler) => {
            try {
                require(`../Handler/${Handler}`)(this);
                console.log(`[ HANDLER ] Loaded ${Handler} System`);
            } catch (e) {
                console.log(`[ HANDLER ] Error Found In Handler Called ${Handler}\n${e}]`);
            }
        });
    }

    async build() {
        this._loadDefinitions();
        this._loadMusicManager();
        this._loadNekoClient();
        this._loadGiveawayManager();
        this._loadRestManager();
        this._loadHandler();
    }

    async deploy() {
        await super.login(this.config.Bot.Token);
    }
};