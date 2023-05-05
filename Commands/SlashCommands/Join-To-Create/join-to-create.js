const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const voiceschema = require('../../../Database/jointocreate');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('join-to-create')
    .setDescription('Hep\'s you in setup, de-setup of join to create voice channel system.')
    .setDMPermission(false)
    .addSubcommand(command => command
        .setName('setup')
        .setDescription('Setups the advanced join to create voice channel system!.')
        .addChannelOption(option => option.setName('channel')
            .setDescription('Specified channel will be your join to create voice channel.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .addChannelOption(option => option
            .setName('category')
            .setDescription('All new channels will be created in specified category.').setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory))
        .addIntegerOption(option => option
            .setName('voice-limit')
            .setDescription('Set the default limit for the new voice channels.')
            .setMinValue(2)
            .setMaxValue(10)
        )
    )
    .addSubcommand(command => command
        .setName('de-setup')
        .setDescription('De-setups the advanced join to create voice channel system!.')
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Guild Or Administrator permission to use this command!` });
 
        const data = await voiceschema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'setup':
 
            if (data) return await interaction.editReply({ content: `You have **already** set up the **join to create** system! \n> Do **/join-to-create disable** to undo.`});
            else {
 
                const channel = await interaction.options.getChannel('channel');
                const category = await interaction.options.getChannel('category');
                const limit = await interaction.options.getInteger('voice-limit') || 3;
 
                await voiceschema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Category: category.id,
                    VoiceLimit: limit
                })
 
                const setupembed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: `🔊 Join to Create system`})
                .setFooter({ text: `🔊 System Setup`})
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setTimestamp()
                .addFields({ name: `• Join to Create was Enabled`, value: `> Your channel (${channel}) will now act as \n> your join to create channel.`})
                .addFields(
                    { name: `• Category`, value: `> ${category}`},
                    { name: `• Voice Limit`, value: `> **${limit}**`, inline: true}
                )
 
                await interaction.editReply({ embeds: [setupembed] });
            }
 
            break;
            case 'de-setup':
 
            if (!data) return await interaction.editReply({ content: `You **do not** have the **join to create** system **set up**, cannot delete **nothing**..`, ephemeral: true});
            else {
 
                const removeembed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: `🔊 Join to Create system`})
                .setFooter({ text: `🔊 System Disabled`})
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setTimestamp()
                .addFields({ name: `• Join to Create was Disabled`, value: `> Your channel (<#${data.Channel}>) will no longer act as \n> your join to create channel.`})
 
                await voiceschema.deleteMany({ Guild: interaction.guild.id });
 
                await interaction.editReply({ embeds: [removeembed] });
            }
        }
    }
}