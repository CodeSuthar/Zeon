require('dotenv').config()

module.exports = {
    Bot: {
        Token: process.env.TOKEN || "ODkzNTU5NzAwMTgyOTU0MDQ1.GJMUDe.d3bm_oDdoXgked0fDM8wRvpB_HL3_rHXonzAYI",
        Prefix: "!",
        NoPrefix: ["990643162928279592", "847770840266833961"],
        DeveloperId: ["1060577145258262541", "847770840266833961"],
        Invite: "https://discord.com/api/oauth2/authorize?client_id=969558840926437406&permissions=1395763178742&scope=bot%20applications.commands"
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
