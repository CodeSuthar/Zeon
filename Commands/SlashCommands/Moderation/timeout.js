const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js')
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Times out a server member.')
    .addUserOption(option => option
        .setName('target')
        .setDescription('The user you would like to time out')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('duration')
        .setRequired(true)
        .setDescription('The duration of the timeout')
        .addChoices(
            { name: '60 Secs', value: '60'},
            { name: '2 Minutes', value: '120'},
            { name: '5 Minutes', value: '300'},
            { name: '10 Minutes', value: '600'},
            { name: '15 Minutes', value: '900'},
            { name: '20 Minutes', value: '1200'},
            { name: '30 Minutes', value: '1800'},
            { name: '45 Minutes', value: '2700'},
            { name: '1 Hour', value: '3600'},
            { name: '2 Hours', value: '7200'},
            { name: '3 Hours', value: '10800'},
            { name: '5 Hours', value: '18000'},
            { name: '10 Hours', value: '36000'},
            { name: '1 Day', value: '86400'},
            { name: '2 Days', value: '172800'},
            { name: '3 Days', value: '259200'},
            { name: '5 Days', value: '432000'},
            { name: '1 Week', value: '604800'},
        )
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('The reason for timing out the user')
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
 
        const timeUser = interaction.options.getUser('target');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const channel = interaction.channel;
        const duration = interaction.options.getString('duration');
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.editReply({ content: "You must have the Moderate Members permission to use this command!" })
        if (!timeMember) return await interaction.editReply({ content: 'The user mentioned is no longer within the server.' })
        if (!duration) return interaction.editReply({content: 'You must set a valid duration for the timeout' })
        if (!timeMember.kickable) return interaction.editReply({ content: 'I cannot timeout this user! This is either because their higher then me or you.' })
        if (interaction.member.id === timeMember.id) return interaction.editReply({content: "You cannot timeout yourself!" })
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply({content: "You cannot timeout staff members or people with the Administrator permission!" })
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given."
 
        await timeMember.timeout(duration * 1000, reason)
 
        const minEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${timeUser.tag} has been **timed out** for ${duration / 60} minute(s) | Reason: ${reason}`)

        const dmEmbed = new EmbedBuilder()
        .setDescription(`You have been timed out in ${interaction.guild.name} for ${duration / 60} minutes. You can check the status of your timeout within the server. | Reason: ${reason}`)
        .setColor(`Random`)

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.editReply({ embeds: [minEmbed] })
    },
}