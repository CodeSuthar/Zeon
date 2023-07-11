const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const DIG = require("discord-image-generation");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("jail a user")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to jail")
    ),
    run: async(client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Jail().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "jail.png"});

        let embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Jail ${member.username}`)
        .setImage("attachment://jail.png")

        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}