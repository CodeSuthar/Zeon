const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Gives You Some Pretty Cool Information About Role")
    .addRoleOption((option) => option
        .setName("role")
        .setDescription("Give me a role to fetch information")
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let role = interaction.options.getRole("role");

        let color = role.color == 0 ? '#000000' : role.color;
        let created = `<t:${Math.round(role.createdTimestamp/1000)}:R>`;
        const embed = new EmbedBuilder()
        .setAuthor({  name: `${role.name}'s Information`, iconURL: client.user.displayAvatarURL() })
        .addFields([
            { name: `General Info`, value: `Role Name: **${role.name}**\nRole Id: \`${role.id}\`\nRole Position: **${role.rawPosition}**\nHex Code: \`${color}\`\nCreated At: ${created}\nMentionability: ${role.mentionable}\nIntegration: ${role.managed}`},
            { name: `Allowed Permissions`, value: `${role.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p => `\`${p}\``).join(", ")}` }
        ])
        .setColor(color)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        
        interaction.editReply({ embeds: [embed] });
    }
}