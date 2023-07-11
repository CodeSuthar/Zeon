const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const DIG = require("discord-image-generation");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("bobross")
    .setDescription("bobross a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to bobross")
        .setRequired(false)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()
        
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Bobross().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {
            name: "bobross.png"
        });

        let embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Bobrossed ${member.username}`)
        .setImage("attachment://bobross.png")
        
        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}