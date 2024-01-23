require('dotenv').config()

module.exports = {
    Bot: {
        Name: "",
        Token: process.env.TOKEN || "",
        Prefix: "!",
        NoPrefix: [""],
        DeveloperId: [""],
        Invite: "",
        SupportServer: ""
    },

    Webhooks: {
        Lavalinks: process.env.LavalinkWebhook || "",
    },

    BotList: {
        TopGG: {
            APIToken: process.env.TopGGToken || "",
            LinkToVote: ""
        }
    },

    Dashboard: {
        ShouldRun: true,
        Information: {
            ClientID: process.env.CLIENT_ID || "",
            ClientSecret: process.env.CLIENT_SECRET || "",
            Domain: process.env.DOMAIN || "",
            CallbackURL: process.env.CallbackURL || "/api/callback",
            Port: 3180,
            Scopes: ["identify", "guilds"],
            ReverseProxy: ""
        } 
    },
    
    MongoConnectorURL: process.env.MONGODB || ""
}