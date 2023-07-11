const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const DIG = require("discord-image-generation");
const { i } = require('mathjs');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("gay")
    .setDescription("gayify a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to gayify")
        .setRequired(false)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Gay().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {
            name: "gay.png"
        });

        let embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Gayify ${member.username}`)
        .setImage("attachment://gay.png")

        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}