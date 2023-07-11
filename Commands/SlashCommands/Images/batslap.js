const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const DIG = require("discord-image-generation");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("batslap")
    .setDescription("Batslaps a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to batslap")
        .setRequired(false)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        let first = interaction.user.displayAvatarURL({ size: 512, dynamic: false });
        let pngfirst = first.replace("webp", "png");
        const img = await new DIG.Batslap().getImage(pngfirst, pngavatar);
        const attach = new AttachmentBuilder(img, {
            name: "batslap.png"
        });

        let embed = new EmbedBuilder()
        .setDescription(`Batslapped ${member.username}`)
        .setImage("attachment://batslap.png")
        .setColor("Random")

        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}