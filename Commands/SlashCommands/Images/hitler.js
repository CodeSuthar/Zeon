const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const DIG = require("discord-image-generation");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("hitler")
    .setDescription("Hitler a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to hitlerify")
        .setRequired(false)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply()

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Hitler().getImage(pngavatar)
        const attachment = new AttachmentBuilder(img, { name: "hitler.png" })

        let embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Hitler ${member.username}`)
        .setImage("attachment://hitler.png")

        await interaction.editReply({ embeds: [embed], files: [attachment] });
    }
}