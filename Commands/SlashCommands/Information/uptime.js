const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the uptime of the bot."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        const duration1 = Math.round((Date.now() - client.uptime)/1000);

        const embed = new EmbedBuilder()
        .setColor("Random")  
        .setTitle(`${client.emoji.online} Uptime`)
        .addFields(
            {
                name: `Local Time`,
                value: `<t:${duration1}:f>` ,
                inline: true,
            },
            {
                name: `Current Uptime`,
                value: `<t:${duration1}:R>` ,
                inline: true,
            },
            {
                name: `Start Time`,
                value: `<t:${duration1}:F>`,
                inline: true,
            },
        )
        .setThumbnail("https://cdn.discordapp.com/avatars/969558840926437406/eadc4efd5655de1b06e8ced1dd2ad72e.png?size=4096")
        .setTimestamp()
        
        interaction.editReply({ 
            embeds: [embed] 
        })
    }
}