const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Gives a role to a every member in the guild')
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
        const { options, guild } = interaction;

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Roles Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Roles Or Administrator permission to use this command!` });

        const subcommand = options.getSubcommand();

        switch (subcommand) {
            case 'all':
                const members = await guild.members.fetch();

                const role = options.getRole('role');

                await interaction.editReply({ content: `${client.emoji.loading} | Giving ${role} to every member in the guild... This may take some time.` });

                await client.sleep(2000);

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

                        await interaction.editReply({ embeds: [embed] });
                    });
                }, 1000).then(async () => {
                    const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.tic} | ${role} has been given to ${num} members in the guild! successfully without any errors!`)

                    await interaction.editReply({ embeds: [embed] });
                });
            
            break;
        }
    }
};