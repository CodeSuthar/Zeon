const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../../Database/prefix.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("setprefix")
    .setDescription("Set the prefix for this server")
    .addStringOption((option) => option
        .setName("prefix")
        .setDescription("The prefix you want to set")
        .setRequired(true)
    ),
    run: async (client, interaction, prefix) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`MANAGE_GUILD Or ADMINISTRATOR\` permissions to execute this command!`);
        
        const data = await db.findOne({ Guild: interaction.guildId });
        const pre = interaction.options.getString("prefix");

        if (!pre) {
            const embed = new EmbedBuilder()
            .setDescription("Please give the prefix that you want to set")
            .setColor("Random")
            return await interaction.editReply({ embeds: [embed] });
        }
        if (pre.length > 5) {
            const embed = new EmbedBuilder()
            .setDescription("You can not set prefix with more than 5 characters")
            .setColor("Random")
            return await interaction.editReply({ embeds: [embed] });
        }
        if (data) {
            data.oldPrefix = prefix;
            data.Prefix = pre;
            await data.save()
            const update = new EmbedBuilder()
            .setDescription(`Your prefix has been updated to **${pre}**`)
            .setColor("Random")
            .setTimestamp()
            return await interaction.editReply({ embeds: [update] });
        } else {
            const newData = new db({
                Guild: interaction.guildId,
                Prefix: pre,
            });
            await newData.save()
            const embed = new EmbedBuilder()
            .setDescription(`Custom prefix in this server is now set to **${pre}**`)
            .setColor("Random")
            .setTimestamp()
            return await interaction.editReply({ embeds: [embed] });
        }
    }
}