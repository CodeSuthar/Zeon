const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js')
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Untimesout a server member')
    .addUserOption(option => option
        .setName('target')
        .setDescription('The user you would like to untimeout')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('The reason for untiming out the user')
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
 
        const timeUser = interaction.options.getUser('target');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.editReply({ content: "You must have the Moderate Members permission to use this command!" })
        if (interaction.member.id === timeMember.id) return interaction.editReply({content: "You cannot untimeout yourself!" })
        if (!timeMember.kickable) return interaction.editReply({ content: 'I cannot timeout this user! This is either because their higher then me or you.' })
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply({content: "You cannot untimeout staff members or people with the Administrator permission!" })
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given."
 
        await timeMember.timeout(null, reason)
 
        const minEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${timeUser.tag}'s timeout has been **removed** | Reason: ${reason}`)

        const dmEmbed = new EmbedBuilder()
        .setDescription(`You have been **untimed out** in ${interaction.guild.name} | Reason: ${reason}}`)
        .setColor(`Random`)

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.editReply({ embeds: [minEmbed] })
    },
}