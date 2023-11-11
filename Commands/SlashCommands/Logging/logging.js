const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType } = require('discord.js');
const db = require(`../../../Database/loggingSchema.js`);

const allLogsNameArray = [
    { name: "Channel", value: "channelLogs" },
    { name: "Emoji", value: "emojiLogs" },
    { name: "Guild Ban", value: "guildBanLogs" },
    { name: "Guild Member", value: "guildMemberLogs" },
    { name: "Guild Role Logs", value: "guildRoleLogs" },
    { name: "Guild Scheduled Event", value: "guildScheduledEventLogs" },
    { name: "Invite Link", value: "inviteLinkLogs" },
    { name: "Message", value: "messageLogs" },
    { name: "Sticker", value: "stickerLogs" },
    { name: "Stage", value: "stageLogs" },
    { name: "Thread", value: "threadLogs" },
    { name: "Voice", value: "voiceStateLogs" },
    { name: "Webhook", value: "webhookLogs" }
]

const val = [
    { name: "Channel", value: "channelLogs" },
    { name: "Emoji", value: "emojiLogs" },
    { name: "Guild Ban", value: "guildBanLogs" },
    { name: "Guild Member", value: "guildMemberLogs" },
    { name: "Guild Role Logs", value: "guildRoleLogs" },
    { name: "Guild Scheduled Event", value: "guildScheduledEventLogs" },
    { name: "Invite Link", value: "inviteLinkLogs" },
    { name: "Message", value: "messageLogs" },
    { name: "Sticker", value: "stickerLogs" },
    { name: "Stage", value: "stageLogs" },
    { name: "Thread", value: "threadLogs" },
    { name: "Voice", value: "voiceStateLogs" },
    { name: "Webhook", value: "webhookLogs" }
]

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('logging')
    .setDescription('Set up logging for your server!')
    .addSubcommand(subcommand => subcommand
        .setName("enable")
        .setDescription("Enable logging for your server!")
        .addStringOption(option => option
            .setName("logging-type")
            .setDescription("The type of logging you want to enable!")
            .setRequired(true)
            .addChoices(
                { name: "📚 | All Logs", value: "allLogs" },
                { name: "📢 | Channel Logs", value: "channelLogs" },
                { name: "😄 | Emoji Logs", value: "emojiLogs" },
                { name: "🚫 | Guild Ban Logs", value: "guildBanLogs" },
                { name: "👥 | Guild Member Logs", value: "guildMemberLogs" },
                { name: "🛡️ | Guild Role Logs", value: "guildRoleLogs" },
                { name: "📅 | Guild Scheduled Event Logs", value: "guildScheduledEventLogs" },
                { name: "🔗 | Invite Link Logs", value: "inviteLinkLogs" },
                { name: "📧 | Message Logs", value: "messageLogs" },
                { name: "💬 | Sticker Logs", value: "stickerLogs" },
                { name: "🎤 | Stage Logs", value: "stageLogs" },
                { name: "🧵 | Thread Logs", value: "threadLogs" },
                { name: "🎙️ | Voice Logs", value: "voiceStateLogs" },
                { name: "🕸️ | Webhook Logs", value: "webhookLogs" }
            )
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to log to!")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
            
    )
    .addSubcommand(subcommand => subcommand
        .setName("disable")
        .setDescription("Disable logging for your server!")
        .addStringOption(option => option
            .setName("logging-type")
            .setDescription("The type of logging you want to disable!")
            .setRequired(true)
            .addChoices(
                { name: "📚 | All Logs", value: "allLogs" },
                { name: "📢 | Channel Logs", value: "channelLogs" },
                { name: "😄 | Emoji Logs", value: "emojiLogs" },
                { name: "🚫 | Guild Ban Logs", value: "guildBanLogs" },
                { name: "👥 | Guild Member Logs", value: "guildMemberLogs" },
                { name: "🛡️ | Guild Role Logs", value: "guildRoleLogs" },
                { name: "📅 | Guild Scheduled Event Logs", value: "guildScheduledEventLogs" },
                { name: "🔗 | Invite Link Logs", value: "inviteLinkLogs" },
                { name: "📧 | Message Logs", value: "messageLogs" },
                { name: "💬 | Sticker Logs", value: "stickerLogs" },
                { name: "🎤 | Stage Logs", value: "stageLogs" },
                { name: "🧵 | Thread Logs", value: "threadLogs" },
                { name: "🎙️ | Voice Logs", value: "voiceStateLogs" },
                { name: "🕸️ | Webhook Logs", value: "webhookLogs" }
            )
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("view")
        .setDescription("View the current logging configuration for your server!")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options, guild, guildId } = interaction;

        const subcommand = options.getSubcommand();

        const loggingData = await db.findOne({ Guild: guildId });

        switch (subcommand) {
            case "enable":
                const loggingType = options.getString("logging-type");
                const channel = options.getChannel("channel");

                if (!loggingType) return await interaction.editReply({ content: `${client.emoji.wrong} | You must provide a logging type!` });
                if (!channel) return await interaction.editReply({ content: `${client.emoji.wrong} | You must provide a channel!` });

                if (!loggingData) {
                    if (loggingType === "allLogs") {
                        const newdblogging = new db({
                            Guild: guildId,
                            channelLogs: {
                                enabled: true,
                                channel: channel.id
                            }
                        });

                        await newdblogging.save();

                        return await interaction.editReply({ content: `${client.emoji.tick} | Successfully enabled all logging to <${channel.id}!` });
                    } else {
                        const newdblogging = new db({
                            Guild: guildId,
                            [loggingType]: {
                                enabled: true,
                                channel: channel.id
                            }
                        });

                        await newdblogging.save();

                        return await interaction.editReply({ content: `${client.emoji.tick} | Successfully enabled ${loggingType} logging to <${channel.id}>!` });
                    }
                } else {
                    if (loggingType === "allLogs") {
                        loggingData.channelLogs = { enabled: true, channel: channel.id };
                        loggingData.emojiLogs = { enabled: true, channel: channel.id };
                        loggingData.guildBanLogs = { enabled: true, channel: channel.id };
                        loggingData.guildMemberLogs = { enabled: true, channel: channel.id };
                        loggingData.guildRoleLogs = { enabled: true, channel: channel.id };
                        loggingData.guildScheduledEventLogs = { enabled: true, channel: channel.id };
                        loggingData.inviteLinkLogs = { enabled: true, channel: channel.id };
                        loggingData.messageLogs = { enabled: true, channel: channel.id };
                        loggingData.stickerLogs = { enabled: true, channel: channel.id };
                        loggingData.stageLogs = { enabled: true, channel: channel.id };
                        loggingData.threadLogs = { enabled: true, channel: channel.id };
                        loggingData.voiceStateLogs = { enabled: true, channel: channel.id };
                        loggingData.webhookLogs = { enabled: true, channel: channel.id };

                        await loggingData.save();

                        return await interaction.editReply({ content: `${client.emoji.tick} | Successfully enabled all logging to <${channel.id}>!` });
                    } else {
                        if (loggingData[loggingType].enabled) {
                            loggingData[loggingType].channel = channel.id;

                            await loggingData.save();

                            return await interaction.editReply({ content: `${client.emoji.tick} | Successfully enabled ${loggingType} logging to <${channel.id}>!` });
                        } else {
                            loggingData[loggingType] = { enabled: true, channel: channel.id };

                            await loggingData.save();

                            return await interaction.editReply({ content: `${client.emoji.tick} | Successfully enabled ${loggingType} logging to <${channel.id}>!` });
                        }
                    }
                }
            break;

            case "disable":
                const loggingType2 = options.getString("logging-type");
                const channel2 = options.getChannel("channel");

                if (!loggingType2) return await interaction.editReply({ content: `${client.emoji.wrong} | You must provide a logging type!` });
                if (!channel2) return await interaction.editReply({ content: `${client.emoji.wrong} | You must provide a channel!` });

                if (!loggingData) {
                    if (loggingType2 === "allLogs") {
                        const newdblogging = new db({
                            Guild: guildId,
                            channelLogs: {
                                enabled: false,
                                channel: null
                            },
                            emojiLogs: {
                                enabled: false,
                                channel: null
                            },
                            guildBanLogs: {
                                enabled: false,
                                channel: null
                            },
                            guildMemberLogs: {
                                enabled: false,
                                channel: null
                            },
                            guildRoleLogs: {
                                enabled: false,
                                channel: null
                            },
                            guildScheduledEventLogs: {
                                enabled: false,
                                channel: null
                            },
                            inviteLinkLogs: {
                                enabled: false,
                                channel: null
                            },
                            messageLogs: {
                                enabled: false,
                                channel: null
                            },
                            stickerLogs: {
                                enabled: false,
                                channel: null
                            },
                            stageLogs: {
                                enabled: false,
                                channel: null
                            },
                            threadLogs: {
                                enabled: false,
                                channel: null
                            },
                            voiceStateLogs: {
                                enabled: false,
                                channel: null
                            },
                            webhookLogs: {
                                enabled: false,
                                channel: null
                            }
                        });

                        await newdblogging.save();

                        return await interaction.editReply({ content: `${client.emoji.tick} | Successfully disabled all logging!` });
                    } else {
                        const newdblogging = new db({
                            Guild: guildId,
                            [loggingType2]: {
                                enabled: false,
                                channel: null
                            }
                        });

                        await newdblogging.save();

                        return await interaction.editReply({ content: `${client.emoji.tick} | Successfully disabled ${loggingType2} logging!` });
                    }
                } else {
                    if (loggingType2 === "allLogs") {
                        loggingData.channelLogs = { enabled: false, channel: null };
                        loggingData.emojiLogs = { enabled: false, channel: null };
                        loggingData.guildBanLogs = { enabled: false, channel: null };
                        loggingData.guildMemberLogs = { enabled: false, channel: null };
                        loggingData.guildRoleLogs = { enabled: false, channel: null };
                        loggingData.guildScheduledEventLogs = { enabled: false, channel: null };
                        loggingData.inviteLinkLogs = { enabled: false, channel: null };
                        loggingData.messageLogs = { enabled: false, channel: null };
                        loggingData.stickerLogs = { enabled: false, channel: null };
                        loggingData.stageLogs = { enabled: false, channel: null };
                        loggingData.threadLogs = { enabled: false, channel: null };
                        loggingData.voiceStateLogs = { enabled: false, channel: null };
                        loggingData.webhookLogs = { enabled: false, channel: null };

                        await loggingData.save();

                        return await interaction.editReply({ content: `${client.emoji.tick} | Successfully disabled all logging!` });
                    } else {
                        if (loggingData[loggingType2].enabled) {
                            loggingData[loggingType2].enabled = false;
                            loggingData[loggingType2].channel = null;

                            await loggingData.save();

                            return await interaction.editReply({ content: `${client.emoji.tick} | Successfully disabled ${loggingType2} logging!` });
                        } else {
                            loggingData[loggingType2] = { enabled: false, channel: null };

                            await loggingData.save();

                            return await interaction.editReply({ content: `${client.emoji.tick} | Successfully disabled ${loggingType2} logging!` });
                        }
                    }
                }
            break;
        }
    }
};