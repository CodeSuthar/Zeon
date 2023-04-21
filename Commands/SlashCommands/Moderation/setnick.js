const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('setnick')
    .setDescription("Changes a member's nickname in this server.")
    .addUserOption(option => option
        .setName('user')
        .setDescription('The user you want to change the nickname of.')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('nickname')
        .setDescription('The nickname you want for the user.')
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Nicknames Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Nicknames Or Administrator permission to use this command!` });

        const nick = interaction.options.getString('nickname');
        const member = interaction.options.getMember('user');

        member.setNickname(nick);

        const embed = new EmbedBuilder()
        .setTitle('Nickname Changed')
        .setDescription(`Successfully changed ${member}'s nickname to ${nick}`)
        .setColor("Random")

        interaction.editReply({ embeds: [embed] });
    }
}
