const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('lock')
    .setDescription("This locks the given channel")
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel you want to lock')
        .addChannelTypes(ChannelType.GuildText)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Channels Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Channels Or Administrator permission to use this command!` });
 
        let channel = interaction.options.getChannel('channel');

        if (!channel) channel = interaction.channel;
 
        channel.permissionOverwrites.create(interaction.guild.id, {SendMessages: false})
 
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${client.emoji.tick} | ${channel} has been locked by a administrator`) 
 
        await interaction.editReply({ embeds: [embed] });
    }
}