const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bot latency"),
    run: async (client, interaction, prefix) => {
        if (!interaction.replied) await interaction.deferReply();
        
        interaction.editReply({ content: `Pinging` }).then(() => {
            let ping = interaction.createdTimestamp - Date.now();
            if (ping <= 0) ping = Date.now() - interaction.createdTimestamp;
            function DBPing() {
                const currentNano = process.hrtime();
                (require("mongoose")).connection.db.command({ ping: 1 });
                const time = process.hrtime(currentNano);
                return Math.round((time[0] * 1e9 + time[1]) * 1e-6);
            }
            interaction.editReply({ content: `Pinged`, 
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: "Pinged The Response Time", iconURL: client.user.displayAvatarURL() })
                    .setColor("Random")
                    .addFields(
                        { name: "Bot Latency", value: `\`\`\`[ ${ping}ms ]\`\`\``, inline: true },
                        { name: "Gateway Latency", value: `\`\`\`[ ${client.ws.ping}ms ]\`\`\``, inline: false },
                        { name: "Gateway Latency", value: `\`\`\`[ ${DBPing()}ms ]\`\`\``, inline: false }
                    )
                ]
            })
        })
    }
}