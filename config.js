require('dotenv').config()

module.exports = {
    Bot: {
        Token: process.env.TOKEN || "",
        Prefix: "!",
        NoPrefix: ["990643162928279592"],
        DeveloperId: ["990643162928279592"]
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
            Domain: process.env.DOMAIN || "https://zeonbot.xyz",
            CallbackURL: process.env.CallbackURL || "/api/callback",
            Port: 8080,
            Scopes: ["identify", "guilds"],
        } 
    },
    
    MongoConnectorURL: process.env.MONGODB || ""
}