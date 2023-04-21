const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows you the bot latency."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        let ping = interaction.createdTimestamp - Date.now();
        let api_ping = client.ws.ping;
        let dbPing = async () => {
            const currentNano = process.hrtime();
            await (require("mongoose")).connection.db.command({ ping: 1 });
            const time = process.hrtime(currentNano);
            return Math.round((time[0] * 1e9 + time[1]) * 1e-6);
        }
        if (ping <= 0) ping = Date.now() - interaction.createdTimestamp;

       const embed1 = new EmbedBuilder()
       .setColor("Random")
       .setDescription(`\`\`\`nim\nAPI Latency      :: ${Math.round(api_ping)} ms \nBot Latency      :: ${ping} ms \nDatabase Latency :: ${await dbPing()} ms\`\`\``)

        return interaction.editReply({ embeds: [embed1] });
    }
}