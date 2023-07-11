require('dotenv').config()

module.exports = {
    Bot: {
        Name: "Zeon",
        Token: process.env.TOKEN || "",
        Prefix: "!",
        NoPrefix: ["990643162928279592"],
        DeveloperId: ["1060577145258262541"],
        Invite: "https://discord.com/oauth2/authorize?client_id=969558840926437406&permissions=2088234238&scope=bot%20applications.commands",
        SupportServer: "https://discord.gg/tHvGtcyh6V"
    },

    BotList: {
        TopGG: {
            APIToken: process.env.TopGGToken || "",
            LinkToVote: "https://top.gg/bot/969558840926437406/vote"
        }
    },

    Dashboard: {
        ShouldRun: true,
        Information: {
            ClientID: process.env.CLIENT_ID || "969558840926437406",
            ClientSecret: process.env.CLIENT_SECRET || "",
            Domain: process.env.DOMAIN || "https://zeon.code-source.tech",
            CallbackURL: process.env.CallbackURL || "/api/callback",
            Port: 20333,
            Scopes: ["identify", "guilds"],
            ReverseProxy: "103.60.13.253"
        } 
    },
    
    MongoConnectorURL: process.env.MONGODB || ""
}