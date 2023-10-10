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

    Webhooks: {
        Lavalinks: process.env.LavalinkWebhook || "https://discord.com/api/webhooks/1160840465348825149/oy24URrTAHnzaRsZS3hAqbRBgGnINrs74WW0qKAchIgBVfYarzVZYdeRCZXAZWT3nWjy",
    },

    BotList: {
        TopGG: {
            APIToken: process.env.TopGGToken || "",
            LinkToVote: "https://top.gg/bot/969558840926437406/vote"
        }
    },

    Music: {
        Spotify: {
            ClientID: process.env.SpotifyClientId || "",
            ClientSecret: process.env.SpotifyClientSecret || ""
        },

        Nodes: [
            {
                name: "Zeon - Lavalink - 1",
                url: "lava1.horizxon.tech:443",
                auth: "horizxon.tech",
                secure: true
            }
        ]
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