const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, InteractionCollector } = require("discord.js");
const Topgg = require("@top-gg/sdk");
const pdata = require("../../Database/premium.js")

module.exports = {
    name: "messageDelete",
    run: async (client, message) => {
        client.snipes.set(message.channel.id, {
            content: `${message.content ? message.content : `**_[Content Unavailable]_**`} `,
            author: message.author.id,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            timestamp: Date.now()
        });
    }
};