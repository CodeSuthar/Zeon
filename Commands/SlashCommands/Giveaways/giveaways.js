const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require(`discord.js`);
const ms = require('ms');
const { mongoose } = require(`mongoose`)

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName(`giveaway`)
    .setDescription(`Start a giveaway or configure already existing ones.`)
    .addSubcommand(command => command
        .setName('start')
        .setDescription('Starts a giveaway with the specified fields.')
        .addStringOption(option => option
            .setName('duration')
            .setDescription(`Specified duration will be the giveaway's duration (in ms)`)
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('winners')
            .setDescription('Specified amount will be the amount of winners chosen.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('prize')
            .setDescription('Specified prize will be the prize for the giveaway.')
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Specified channel will receive the giveaway.')
        )
        .addStringOption(option => option
            .setName('content')
            .setDescription('Specified content will be used for the giveaway embed.')
        )
    )
    .addSubcommand(command => command
        .setName(`edit`)
        .setDescription(`Edits specified giveaway.`)
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('Specify the message ID of the giveaway you want to edit.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('time')
            .setDescription('Specify the added duration of the giveaway (in ms).').setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('winners')
            .setDescription('Specify the new ammount of winners.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('prize')
            .setDescription('Specify the new prize for the giveaway.')
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName('end')
        .setDescription(`Ends specified giveaway.`)
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('Specify the message ID of the giveaway you want to end.')
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName(`reroll`)
        .setDescription(`Rerolls specified giveaway.`)
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('Specify the message ID of the giveaway you want to reroll.')
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName(`pause`)
        .setDescription("Pauses A Giveaway")
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('Specify the message ID of the giveaway you want to pause.')
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName(`resumes`)
        .setDescription("Resumes A Giveaway")
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('Specify the message ID of the giveaway you want to resumes.')
            .setRequired(true)
        )
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Roles Or Administrator permission to use this command!` });
        }
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'start':
            // GIVEAWAY START COMMAND CODE //
 
            const duration = ms(interaction.options.getString("duration"));
            if (!duration) return interaction.editReply({ content: `${client.emoji.wrong} | You must specify a valid duration!` })
            const winnerCount = interaction.options.getInteger('winners');
            const prize = interaction.options.getString('prize');
            const contentmain = interaction.options.getString(`content`);
            const channel = interaction.options.getChannel("channel");
            const showchannel = interaction.options.getChannel('channel') || interaction.channel;
            if (!channel && !contentmain) {

                client.giveawayManager.start(interaction.channel, {
                    prize,
                    winnerCount,
                    duration,
                    hostedBy: interaction.user,
                    lastChance: {
                        enabled: false,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: 'Random'
                    },
                    messages: {
                        drawing: "Ends in: {timestamp}\n",
                        hostedBy: "**Hosted by:**\n{this.hostedBy}",
                        noWinner: "Giveaway cancelled, no valid participations.\n",
                        endedAt: "Ended at", 
                        giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                        giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                        winMessage: `Congratulations! You have won the giveaway for **{this.prize}**, Click here ({this.messageURL}) to jump to the giveaway message!`,
                        embedFooter: '{this.winnerCount} Winner{this.winnerCount > 1 ? "s" : ""}'
                    }
                });
            } else if (!channel) {
                client.giveawayManager.start(interaction.channel, {
                    prize,
                    winnerCount,
                    duration,
                    hostedBy: interaction.user,
                    lastChance: {
                        enabled: true,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: 'Random'
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: `${client.config.paused} This giveaway has been paused!** ${client.config.paused}`,
                        unPauseAfter: null,
                        embedColor: 'Random'
                    },
                    messages: {
                        drawing: "Ends in: {timestamp}\n",
                        hostedBy: "**Hosted by:**\n{this.hostedBy}",
                        noWinner: "Giveaway cancelled, no valid participations.\n",
                        endedAt: "Ended at", 
                        giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                        giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                        winMessage: `Congratulations! You have won the giveaway for **{this.prize}**, Click here ({this.messageURL}) to jump to the giveaway message!`,
                        embedFooter: '{this.winnerCount} Winner{this.winnerCount > 1 ? "s" : ""}'
                    }
                });
            } else if (!contentmain) {
                client.giveawayManager.start(channel, {
                    prize,
                    winnerCount,
                    duration,
                    hostedBy: interaction.user,
                    lastChance: {
                        enabled: false,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: 'Random'
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: `${client.config.paused} This giveaway has been paused!** ${client.config.paused}`,
                        unPauseAfter: null,
                        embedColor: 'Random'
                    },
                    messages: { 
                        drawing: "Ends in: {timestamp}\n",
                        hostedBy: "**Hosted by:**\n{this.hostedBy}",
                        noWinner: "Giveaway cancelled, no valid participations.\n",
                        endedAt: "Ended at", 
                        giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                        giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                        winMessage: `Congratulations! You have won the giveaway for **{this.prize}**, Click here ({this.messageURL}) to jump to the giveaway message!`,
                        embedFooter: '{this.winnerCount} Winner{this.winnerCount > 1 ? "s" : ""}'
                    }
                });
            } else {
                client.giveawayManager.start(channel, {
                    prize,
                    winnerCount,
                    duration,
                    hostedBy: interaction.user,
                    lastChance: {
                        enabled: true,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: 'Random'
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: `${client.config.paused} This giveaway has been paused!** ${client.config.paused}`,
                        unPauseAfter: null,
                        embedColor: 'Random'
                    },
                    messages: {
                        drawing: "Ends in: {timestamp}\n",
                        hostedBy: "**Hosted by:**\n{this.hostedBy}",
                        noWinner: "Giveaway cancelled, no valid participations.\n",
                        endedAt: "Ended at", 
                        giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                        giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                        winMessage: `Congratulations! You have won the giveaway for **{this.prize}**, Click here ({this.messageURL}) to jump to the giveaway message!`,
                        embedFooter: '{this.winnerCount} Winner{this.winnerCount > 1 ? "s" : ""}'
                    }
                });
            }
 
                return interaction.editReply({ content: `Your **giveaway** has started successfuly! Check ${showchannel}.` })
 
 
            // EDIT GIVEAWAY CODE //
 
            break;
            case 'edit':
            await interaction.editReply({ content: `**Editing** your giveaway..` });
 
            const newprize = interaction.options.getString('prize');
            const newduration = interaction.options.getString('time');
            const newdurationinms = ms(newduration);
            if (!newdurationinms) return interaction.editReply({ content: `${client.emoji.wrong} | You must specify a valid duration!`})
            const newwinners = interaction.options.getInteger('winners');
            const messageId = interaction.options.getString('message-id');

            if (!messageId) return interaction.editReply({ content: `${client.emoji.wrong} | **Couldn't** find a **giveaway** with the ID of "**${query}**".` });

            client.giveawayManager.edit(messageId, {
                addTime: ms(newduration),
                newWinnerCount: newwinners,
                newPrize: newprize
            }).then(() => {
                interaction.editReply({ content: `Your **giveaway** has been **edited** successfuly!` });
            }).catch((err) => {
                interaction.editReply({ content: `An **error** occured! Please contact **Rtxeon#4726** if this issue continues. \n> **Error**: ${err}` });
            });
 
            // END GIVEAWAY CODE //
            break;
            case 'end':
 
            await interaction.editReply({ content: `**Ending** your giveaway..` });
 
            const messageId1 = interaction.options.getString('message-id');

            if (!messageId1) return interaction.editReply({ content: `${client.emoji.wrong} | **Couldn't** find a **giveaway** with the ID of "**${query}**".` });

            client.giveawayManager.end(messageId1).then(() => {
                interaction.editReply({ content: 'Your **giveaway** has ended **successfuly!**' });
            })
            .catch((err) => {
                interaction.editReply({ content: `An **error** occured! Please contact **Rtxeon#4726** if this issue continues. \n> **Error**: ${err}` });
            });
 
            break;
            case 'reroll':
            // REROLL GIVEAWAY CODE //
            await interaction.editReply({ content: `**Rerolling** your giveaway..` });
 
            const query = interaction.options.getString('message-id');
            const giveaway = client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === query) || client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === query);

            if (!giveaway) return interaction.editReply({ content: `${client.emoji.wrong} | **Couldn't** find a **giveaway** with the ID of "**${query}**".` });

            const messageId2 = interaction.options.getString('message-id');
            client.giveawayManager.reroll(messageId2).then(() => {
                interaction.editReply({ content: `Your **giveaway** has been **successfuly** rerolled!`});
            })
            .catch((err) => {
                interaction.editReply({ content: `An **error** occured! Please contact **Rtxeon#4726** if this issue continues. \n> **Error**: ${err}` });
            });
            break;

            case 'pause':
            // PAUSE GIVEAWAY CODE //
            await interaction.editReply({ content: `**Pausing** your giveaway..` });
 
            const msgid = interaction.options.getString('message-id');
            const gw = client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === msgid) || client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === msgid);

            if (!gw) return interaction.editReply({ content: `${client.emoji.wrong} | **Couldn't** find a **giveaway** with the ID of "**${msgid}**".` });

            const messageId3 = interaction.options.getString('message-id');
            client.giveawayManager.pause(messageId3).then(() => {
                interaction.editReply({ content: `Your **giveaway** has been **successfuly** paused!`});
            })
            .catch((err) => {
                if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is already ended.`)) {
                    interaction.editReply({ content : "This giveaway is already ended!" });
                } else {
                    console.log(e)
                    interaction.editReply({ content: `An **error** occured! Please contact **Rtxeon#4726** if this issue continues. \n> **Error**: ${err}` });
                }
            });
            break;

            case 'resume':
            // RESUME GIVEAWAY CODE //
            await interaction.editReply({ content: `**Resuming** your giveaway..` });
 
            const msgid2 = interaction.options.getString('message-id');
            const gw2 = client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === msgid2) || client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === msgid2);

            if (!gw2) return interaction.editReply({ content: `${client.emoji.wrong} | **Couldn't** find a **giveaway** with the ID of "**${msgid2}**".` });

            const messageId4 = interaction.options.getString('message-id');
            client.giveawayManager.unpause(messageId4).then(() => {
                interaction.editReply({ content: `Your **giveaway** has been **successfuly** resumed!`});
            }).catch((err) => {
                if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is already ended.`)) {
                    interaction.editReply({ content : "This giveaway is already ended!" });
                } else {
                    console.log(e)
                    interaction.editReply({ content: `An **error** occured! Please contact **Rtxeon#4726** if this issue continues. \n> **Error**: ${err}` });
                }
            });
            break;
        }
    }
}
