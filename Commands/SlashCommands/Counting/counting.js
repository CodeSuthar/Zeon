const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const countingSchema = require(`../../../Database/countingSchema`)

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Help\'s you in setup, de-setup, blocking user, unblocking user in counting game system.')
    .addSubcommandGroup(group => group
        .setName('game')
        .setDescription('The classic game of counting!')
        .addSubcommand(subcommand => subcommand
            .setName('setup')
            .setDescription('Setups the counting game system!')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the game will be played!')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('de-setup')
            .setDescription('De-setups the counting game system!')
        )
    )
    .addSubcommandGroup(group => group
        .setName(`user`)
        .setDescription('Group for command block and unblock which helps to block and unblock user from counting game!')
        .addSubcommand(subcommand => subcommand
            .setName('block')
            .setDescription('Blocks the user from counting game!')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to block from counting game!')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('unblock')
            .setDescription('Unblocks the user from counting game!')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to unblock from counting game!')
                .setRequired(true)
            )
        )
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        const { options, guildId, guild, member } = interaction;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Guild Or Administrator permission to use this command!` });

        const SubGroup = options.getSubcommandGroup();

        switch (SubGroup) {
            case 'game': 
                const SubCommand = options.getSubcommand();

                switch (SubCommand) {
                    case 'setup':
                        const channel = options.getChannel('channel');

                        const Data = await countingSchema.findOne({ Guild: guildId });

                        if (!Data) {
                            await countingSchema.create({
                                Guild: guildId,
                                Channel: channel.id,
                                Count: 1,
                                LastPerson: ""
                            });

                            const setupembed = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• Counting game system is setupped now`, value: `> This channel (<#${channel.id}>) will now act as \n> counting game channel.`})

                            return interaction.editReply({
                                embeds: [
                                    setupembed
                                ]
                            })
                        } else {

                            const setupembed2 = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• Counting game system is channel has been changed now`, value: `> Counting game system was enabled already. So, I removed the old channel and configured <#${channel.id}> as new counting game channel.`})

                            return interaction.editReply({
                                embeds: [
                                    setupembed2
                                ]
                            })
                        }
                    break;

                    case 'de-setup':
                        const Dataa = await countingSchema.findOne({ Guild: guildId });

                        if (!Dataa) {
                            const desetupembed = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• Error:`, value: `> Counting setup system should be setupped for this action but\n> the counting setup system isn't setupped.`})
                         
                            return interaction.editReply({
                                embeds: [
                                    desetupembed
                                ]
                            });
                        } else {
                            await countingSchema.findOneAndDelete({ Guild: guildId });

                            await client.db.set(`Counting_${guildId}`, '1234')

                            const desetupembed2 = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• Counting game system is de-setupped now`, value: `> Counting game system is de-setupped now.\n> <#${Dataa.Channel}> channel will not act up as counting game channel.`})

                            return interaction.editReply({
                                embeds: [
                                    desetupembed2
                                ]
                            });
                        }
                }
            break;
            
            case 'user':
                const SubCommand2 = options.getSubcommand();

                switch (SubCommand2) {
                    case 'block':
                        const user = options.getUser('user');

                        const CountingData = await countingSchema.findOne({ Guild: guildId });

                        if (!CountingData) {
                            const setupembed3 = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• Error:`, value: `> Counting setup system should be setupped for this action but\n> the counting setup system isn't setupped.`})

                            return interaction.editReply({
                                embeds: [
                                    setupembed3
                                ]
                            });
                        } else {
                            const ch = await guild.channels.cache.get(CountingData.Channel) || await guild.channels.fetch(CountingData.Channel);

                            ch.permissionOverwrites.edit(user.id, { SendMessages: false }).catch((e) => {
                                const setupembed4 = new EmbedBuilder()
                                .setColor('Random')
                                .setAuthor({ name: `🔢 | Counting Game System`})
                                .setFooter({ text: `🔢 | System Setup`})
                                .setThumbnail(client.user.displayAvatarURL())
                                .setTimestamp()
                                .addFields({ name: `• Error:`, value: `> I can't block <@${user.id}> from counting game system\n> Error: ${e}`})

                                return interaction.editReply({
                                    embeds: [
                                        setupembed4
                                    ]
                                });
                            });

                            const setupembed5 = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• User Blocked:`, value: `> <@${user.id}> has been blocked from counting game system.`})

                            return interaction.editReply({
                                embeds: [
                                    setupembed5
                                ]
                            });
                        }
                    break;

                    case 'unblock':
                        const user2 = options.getUser('user');

                        const CountingData2 = await countingSchema.findOne({ Guild: interaction.guild.id });
                        
                        if (!CountingData2) {
                            const setupembed6 = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• Error:`, value: `> Counting setup system should be setupped for this action but\n> the counting setup system isn't setupped.`})

                            return interaction.editReply({
                                embeds: [
                                    setupembed6
                                ]
                            });
                        } else {
                            const ch2 = await guild.channels.cache.get(CountingData2.Channel) || await guild.channels.fetch(CountingData2.Channel);

                            ch2.permissionOverwrites.edit(user2.id, { SendMessages: true }).catch((e) => {
                                const setupembed7 = new EmbedBuilder()
                                .setColor('Random')
                                .setAuthor({ name: `🔢 | Counting Game System`})
                                .setFooter({ text: `🔢 | System Setup`})
                                .setThumbnail(client.user.displayAvatarURL())
                                .setTimestamp()
                                .addFields({ name: `• Error:`, value: `> I can't unblock <@${user2.id}> from counting game system\n> Error: ${e}`})

                                return interaction.editReply({
                                    embeds: [
                                        setupembed7
                                    ]
                                });
                            });

                            const setupembed8 = new EmbedBuilder()
                            .setColor('Random')
                            .setAuthor({ name: `🔢 | Counting Game System`})
                            .setFooter({ text: `🔢 | System Setup`})
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTimestamp()
                            .addFields({ name: `• User Unblocked:`, value: `> <@${user2.id}> has been unblocked from counting game system.`})

                            return interaction.editReply({
                                embeds: [
                                    setupembed8
                                ]
                            });
                        }
                    break;
                }
            break;           
        }
    }
}