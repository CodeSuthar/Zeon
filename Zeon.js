const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client(
    Heart(GatewayIntentBits, Partials)
);
  
[ "Client-Extended", "ClientEvents", "Commands", "SlashAndContextCommands", "ConnectMongo", "HandlingError", "GiveawayEvents", "JoinToCreate" ].forEach((Handler) => {
    try {
        require(`./Handler/${Handler}`)(client);
        console.log(`[ HANDLER ] Loaded ${Handler} System`);
    } catch (e) {
        console.log(`Error Found In Handler Called ${Handler}\n${e}`);
    }
})

client.login(client.config.Bot.Token);

module.exports = client;

function Heart(blood, oxygen) {
    return {
        shards: "auto",
        failIfNotExists: true,
        allowedMentions: {
            parse: [],
            repliedUser: false
        },
        intents: [
            blood.Guilds,
            blood.MessageContent,
            blood.GuildMembers,
            blood.GuildMessages,
            blood.DirectMessages,
            blood.GuildInvites,
            blood.GuildMessageReactions,
            blood.GuildVoiceStates
        ],
        partials: [ 
            oxygen.Channel, 
            oxygen.Message, 
            oxygen.User, 
            oxygen.GuildMember
        ]
    }
};