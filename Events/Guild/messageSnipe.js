const { MessageType } = require("discord.js");
module.exports = {
    name: "messageDelete",
    run: async (client, message) => {
        if (!message.guild) return;
        if (message.type === MessageType.ChatInput) return;
        
        client.snipes.set(message.channel.id, {
            content: `${message.content ? message.content : `**_[Content Unavailable]_**`} `,
            author: message.author.id,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            timestamp: Date.now()
        });
    }
};