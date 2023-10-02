const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Clone A Channel Then Delete The Old One And Makes Rhw Channel New ANd More Clean!')
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel you want to lock')
        .addChannelTypes(ChannelType.GuildText)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        const { options, guild } = interaction;

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Channels Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Channels Or Administrator permission to use this command!` });

        let ch = options.getChannel("channel");

        if (!ch) ch = interaction.channel;

        const interactionChannelId = interaction.channel.id;

        try {
            return ch.clone().then(async (channel) => {
                await channel.setParent(ch.parent);
                await channel.setPosition(ch.position);
                await channel.send({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | The channel has been successfully nuked!`).setImage("https://i.imgur.com/LIyGeCR.gif")] })
                await ch.delete();

                if (interactionChannelId !== ch.id) await interaction.editReply({ content: `${client.emoji.tick} | The channel has been successfully nuked!` });
            });
        } catch (e) {
            await interaction.editReply({ content: `${client.emoji.wrong} | An error occurred while cloning the channel!` });
        }
    }
};