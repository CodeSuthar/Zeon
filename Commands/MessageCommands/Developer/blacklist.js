const discordinfo = require("discordinfo.js");

module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    description: "Blacklist a user from using the bot",
    category: "Developer",
    developer: true,
    run: async (message, args, client, prefix) => {
        try {
            const info = new discordinfo({
                token: client.config.Bot.Token
            });
    
            const id = args[0];
    
            if (!id) return message.reply("Please provide a user ID");

            const syt = await info.getUser(id);

            const db  = await client.db.get(`blacklist_${syt.id}`);

            if (!db) {
                await client.db.set(`blacklist_${syt.id}`, true)
                message.reply(`${syt.username}#${syt.discriminator} has been added to the blacklist`)
            } else {
                message.reply(`${syt.username}#${syt.discriminator} is already blacklisted, so I can't add them from the blacklist`)
            }

        } catch (e) {
            console.log(e);
            message.reply("An error occurred, please try again later");
        }
        
    }
};