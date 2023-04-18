const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const e = require('express');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('mass-unban')
    .setDescription('Unban all members in the server. Use with caution!'),
    run: async (client, interaction, args) => {
        if (!interaction.replied) await interaction.deferReply();
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!'});
 
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