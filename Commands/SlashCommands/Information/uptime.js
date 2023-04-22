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
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        
        interaction.editReply({ 
            embeds: [embed] 
        })
    }
}