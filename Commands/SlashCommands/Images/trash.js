const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const DIG = require("discord-image-generation");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("trash")
    .setDescription("trash a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to trash")
        .setRequired(false)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Trash().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {
            name: "trash.png"
        });

        let embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Trash ${member.username}`)
        .setImage("attachment://trash.png")

        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}