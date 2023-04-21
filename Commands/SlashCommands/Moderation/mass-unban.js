const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const e = require('express');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('mass-unban')
    .setDescription('Unban all members in the server. Use with caution ⚠️!.'),
    run: async (client, interaction, args) => {
        if (!interaction.replied) await interaction.deferReply();
 
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Ban Members Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Ban Members Or Administrator permission to use this command!` });
 
        try {
 
            const bannedMembers = await interaction.guild.bans.fetch();
 
            await Promise.all(bannedMembers.map(member => {
                return interaction.guild.members.unban(member.user.id).catch(e => console.error(e));
            }));
 
            return interaction.editReply({ content: 'All members have been **unbanned** from the server.', ephemeral: true });
        } catch (e) {
            console.error(e);
            return interaction.editReply({ content: 'An error occurred while **unbanning** members.', ephemeral: true });
        }
    }
};