const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Role Subcommands.")
    .addSubcommand(subcommand => subcommand
        .setName("info")
        .setDescription("Shows the role information.")
        .addRoleOption(option => option
           .setName("role")
           .setDescription("The role of which you want to get information.")
           .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('all')
        .setDescription('Gives a role to a every member in the guild')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role you want to give to every member in the guild')
            .setRequired(true)
        )
    ),   
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let subcommand = interaction.options.getSubcommand();

        if (subcommand === "info") {
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
            
            return interaction.editReply({ embeds: [embed] });
        } else if (subcommand === "all") {
            const members = await guild.members.fetch();

            const role = options.getRole('role');
            await interaction.editReply({ content: `${client.emoji.loading} | Giving ${role} to every member in the guild... This may take some time.` });
            await client.wait(2000);
            let num = 0;
            setTimeout(async () => {
                members.forEach(async (member) => {
                    member.roles.add(role).catch((e) => {
                        return;
                    });
                    num++;
                    const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.loading} | ${role} has been given to ${num} members in the guild!`)
                    await interaction.editReply({ content: "", embeds: [embed] });
                });
            }, 2000).then(async () => {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.tick} | ${role} has been given to ${num} members in the guild! successfully without any errors!`)
                await interaction.editReply({ content: "", embeds: [embed] });
            });
        }
    }
}