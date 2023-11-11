const { MessageType } = require("discord.js");
module.exports = {
    name: "messageDelete",
    run: async (client, message) => {
        if (!message.guild) return;
        if (message.type === MessageType.ChatInput) return;

        let author = message.author;

        let m = message.author.id

        if (!m) m = message.author.tag;

        if (!m) m = message.author.username;

        if (!m) m = message.author;

        if (!m) m = "Unknown User"
        
        client.snipes.set(message.channel.id, {
            content: `${message.content ? message.content : `**_[Content Unavailable]_**`} `,
            author: m,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            timestamp: Date.now()
        });
    }
};