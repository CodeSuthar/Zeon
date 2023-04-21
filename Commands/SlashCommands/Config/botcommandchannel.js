const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("botcommandchannel")
    .setDescription("Enables or disables the Bot to listen commands in a specific Channel")
    .addSubcommand((subcommand) => subcommand
        .setName("enable")
        .setDescription("Enables the Bot to listen commands in a specific channel")
        .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The Channel where you want to enable The Bot to listen commands")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("disable")
        .setDescription("Disables the Bot to listen commands in a specific channel")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply({ content: "You must have the Manage Guild Or Administrator permission to use this command!" });

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "enable": 

                const data = await client.db.get(`botcommandchannel_${interaction.guild.id}`);

                if (data) {
                    const channel2 = await client.db.get(`botcommandchannel_channel_${interaction.guild.id}`);

                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                    .setFooter({ text: `🤖 | System Setup`})
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields({ name: `• Error:`, value: `> Bot Command Channel is already enabled and setupped in <#${channel2}>.`})

                    return interaction.editReply({ embeds: [setupembed] });
                } else {
                    const channel = interaction.options.getChannel("channel");

                    await client.db.set(`botcommandchannel_${interaction.guild.id}`, true).then(() => {
                        client.db.set(`botcommandchannel_channel_${interaction.guild.id}`, channel.id);
                    })
                    

                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                    .setFooter({ text: `🤖 | System Setup`})
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields({ name: `• Bot Command Channel is enabled now`, value: `> This channel (<#${channel.id}>) will now act as \n> the only channel to listen the bot command.`})

                    return interaction.editReply({ embeds: [setupembed] });
                }

            break;

            case "disable":
                const data2 = await client.db.get(`botcommandchannel_${interaction.guild.id}`)
                
                if (!data2) {
                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                    .setFooter({ text: `🤖 | System Setup`})
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields({ name: `• Error:`, value: `> Bot Command Channel is not setupped. So, I can't disable it.`})

                    return interaction.editReply({ embeds: [setupembed] })
                } else {
                    const ch = await client.db.get(`botcommandchannel_channel_${interaction.guild.id}`);
                    
                    await client.db.set(`botcommandchannel_${interaction.guild.id}`, false);

                    await client.db.set(`botcommandchannel_channel_${interaction.guild.id}`, false);

                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                    .setFooter({ text: `🤖 | System Setup`})
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields({ name: `• Bot Command Channel is disabled now`, value: `> This channel (${channel}) will now  not act up as \n> the only channel to listen the bot command.`})

                    botcommandchannelSchema.deleteOne({ Guild: interaction.guild.id })

                    return interaction.editReply({ embeds: [setupembed] })
                }
            break;
        }
    }
};