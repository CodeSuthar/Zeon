const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserSchema = require("../../../Database/user.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Shows your profile")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("Give me a user to show his profile")
        .setRequired(true)
    ),
    run: async (client, interaction, prefix) => {
        if (!interaction.replied) await interaction.deferReply();
        let member = interaction.options.getMember("user");

        let data = await UserSchema.findOne({ UserId: member.id });

        if (!data) {
            const newUser = new UserSchema({
              UserId: member.id,
            });

            await newUser.save();

            data = await UserSchema.findOne({ UserId: member.id });
        }

        let badge;

        if (data && data.badges) {
            badge = data.badges.join("\n");
            if (!badge || !badge.length) badge = `\`None\``;
        } else {
            badge = `\`None\``;
        }

        const embed = new EmbedBuilder()
        .setTitle("Profile")
        .setDescription(`User: **${member.user.tag}**`)
        .addFields({ name: "Badges", value: badge })
        .setColor("Random");

        return interaction.editReply({ embeds: [embed] });

    }
};