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
        .setThumbnail("https://images-ext-2.discordapp.net/external/3YbuwJp3jpUlJxb2mF3R52U6M8WCT3-4t_Z9g44WuSQ/%3Fsize%3D128/https/cdn.discordapp.com/avatars/969558840926437406/b01ac26a45368a5b241ea1c09c7bda4a.webp")
        .setFooter({ text: `Zeon Development 💖`, iconURL: "https://images-ext-1.discordapp.net/external/lzR6jeDYThwRRvQHu6uEvedNACkrFmY8HxleMNfx2r8/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/969558840926437406/9d2c7499963e7b2d409bca59f4a24a60.png?width=558&height=558"})
        .setTimestamp()
        
        interaction.editReply({ embeds: [embed] })
    }
}