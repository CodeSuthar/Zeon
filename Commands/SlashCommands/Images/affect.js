const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const DIG = require("discord-image-generation");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("affect")
    .setDescription("affectify a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to affectify")
        .setRequired(false)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Affect().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {
            name: "affect.png"
        });

        let embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Affectified ${member.username}`)
        .setImage("attachment://affect.png")

        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}