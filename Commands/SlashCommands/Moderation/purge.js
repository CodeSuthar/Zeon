const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const { filter } = require('lodash');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purges a given amount of messages.')
    .addIntegerOption(option => option
        .setName('amount')
        .setDescription('The amount of messages you want to purge.')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel in which you want messages to be purged.')
        .addChannelTypes(ChannelType.GuildText)
    ),
    run: async (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Messages Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Messages Or Administrator permission to use this command!` });

        const amount = interaction.options.getInteger('amount');

        let channel = interaction.options.getChannel('channel');

        if (!channel) channel = interaction.channel;

        await channel.bulkDelete(amount)

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${client.emoji.tick} | ${amount} messages have been purged in ${channel} by the administrator`)

        const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
            .setCustomId('purge')
            .setEmoji('🗑️')
            .setStyle(ButtonStyle.Primary)
        )

        const msg = await interaction.reply({ embeds: [embed], components: [row] }); 
        
        const filter = i => i.user.id === interaction.user.id;

        const collector = msg.createMessageComponentCollector({ filter, time: 10000 });

        collector.on('collect', async (int) => {
            if (int.customId === 'purge') {
                if (int.deferred) await int.deferUpdate();
                await int.deleteReply();
            }
        });
    }
};