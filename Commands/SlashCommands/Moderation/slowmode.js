const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode of a channel')
    .addIntegerOption(option => option
        .setName('duration')
        .setDescription('The time of the slowmode')
        .setRequired(true)
    )
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel you want to set the slowmode of')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
    run: async(client, interaction, args) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply(`Hey Buddy, I need \`Manage Channels Or Administrator\` permissions to execute this command!`);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply(`Hey Buddy, You need \`Manage Channels Or Administrator\` permissions to execute this comand!`);
 
        const { options } = interaction;
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;
 
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${client.emoji.tick} | ${channel} now has ${duration} seconds of **slowmode**`)
 
        channel.setRateLimitPerUser(duration).catch(err => {
            return;
        });
 
        await interaction.editReply({ embeds: [embed] });
    }
}