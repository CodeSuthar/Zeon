const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    description: "Gets The Response Time",
    usage: "ping",
    cooldown: 5,
    run: async (message, args, client, prefix) => {
        function DBPing() {
                const currentNano = process.hrtime();
                (require("mongoose")).connection.db.command({ ping: 1 });
                const time = process.hrtime(currentNano);
                return Math.round((time[0] * 1e9 + time[1]) * 1e-6);
        }
        message.reply({ content: `Pinging` }).then((msg) => {
            const pinged = new EmbedBuilder()
            .setAuthor({ name: "Pinged The Response Time", iconURL: client.user.displayAvatarURL() })
            .setColor("Random")
            .addFields(
                { name: "Bot Latency", value: `\`\`\`[ ${msg.createdAt - message.createdAt}ms ]\`\`\`` },
                { name: "Gateway Latency", value: `\`\`\`[ ${client.ws.ping}ms ]\`\`\`` },
                { name: "Database Latency", value: `\`\`\`[ ${DBPing()}ms ]\`\`\`` }
            )
            msg.edit({ content: `Pinged`, embeds: [pinged] })
        })
    }
}