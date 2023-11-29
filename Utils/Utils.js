const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Bot, Dashboard } = require(`../config.js`)
const setupSchema = require("../Database/MusicSetup.js");
const { readdirSync } = require("fs");
const logdb = require("../Database/loggingSchema.js");

function GetChoicesCommand() {
    const rest = new REST({ version: '9' }).setToken(Bot.Token);

    let sls;

    let choices = [];

    (async () => {
        try {
            console.log('[ Slash CMD ] Started fetching application (/) commands.');

            sls = await rest.get(
                Routes.applicationCommands(Dashboard.Information.ClientID)
            );

            sls.forEach((data) => {
                choices.push(data.name)
            });
        } catch (error) {
            console.error(error);
        }
    })();

    return choices
}

function convertTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (duration >= 86400000) "◉ LIVE";
    if (duration >= 3600000) return hours + ":" + minutes + ":" + seconds;
    if (duration < 3600000) return minutes + ":" + seconds;
}

function CapitalizeText(text) {
    const capitalizedSentence = text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return capitalizedSentence
}

function chunk(arr, size) {
    const temp = [];
    for (let i = 0; i < arr.length; i += size) {
        temp.push(arr.slice(i, i + size));
    }
    return temp;
}

async function updateQueue(client, queue, guild) {
    try {
        let data = await setupSchema.findOne({ _id: guild.id });
        let color = "#050f39"
        let map = queue.tracks.map((x, i) => `**${i + 1}.** ${x.title && x.uri ? `[${x.title}](${x.uri})` : `${x.title}`}`);
        let pages = chunk(map, 2).map((x) => x.join("\n"));
        let page = 0;
        if (queue && queue.currentTrack) {
            let icon = queue.currentTrack.thumbnail ? queue.currentTrack.thumbnail : client.user.displayAvatarURL();
            if (data && data.channel && data.message) {
                let author = queue.currentTrack.author ? queue.currentTrack.author : 'Unknown'
                let guildId = client.guilds.cache.get(data._id)
                let textChannel = guildId.channels.cache.get(data.channel);
                if (textChannel) {
                    let message;
                    try {
                        message = await textChannel.messages?.fetch(data.message, { cache: true, force: true });
                    } catch (error) { };

                    if (!message) return;
                    let fields = []

                    fields.push(
                        {
                            name: "Queued Track(s)",
                            value: `${queue.tracks.size ? queue.tracks.size : `0`}`,
                            inline: true
                        },
                        {
                            name: "Track Loop",
                            value: `${queue.repeatMode === 1 ? `${client.emoji.tick}` : `${client.emoji.wrong}`}`,
                            inline: true
                        },
                        {
                            name: "Requested by",
                            value: `${queue.currentTrack.requestedBy}`,
                            inline: true
                        },
                        {
                            name: "Autoplay",
                            value: `${queue.repeatMode === 3 ? `${client.emoji.tick}` : `${client.emoji.wrong}`}`,
                            inline: true
                        },
                        {
                            name: "Duration",
                            value: `${queue.currentTrack.duration}`,
                            inline: true
                        }
                    );
                    if (queue.tracks.size > 0) {
                        fields.push({
                            name: `Up next`,
                            value: `${pages[page]}`,
                            inline: true
                        });
                    } else {
                        fields.push(
                            {
                                name: `Author`,
                                value: `${author}`,
                                inline: true
                            },
                        )
                    }
                    let embed1 = new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Queue statistics")
                    .addFields(fields)
                    let disabled = true;
                    if (queue && queue.currentTrack) disabled = false;
                    
                    let lowvolumebut = new ButtonBuilder()
                    .setCustomId(`SETUP_VOL_DOWN_BUTTON`)
                    .setEmoji(`${client.emoji.volumedown}`)
                    .setStyle(2)
                    .setDisabled(disabled)

                    let stopbut = new ButtonBuilder()
                    .setCustomId(`SETUP_STOP_BUTTON`)
                    .setEmoji(`${client.emoji.stop}`)
                    .setStyle(2)
                    .setDisabled(disabled)

                    let pausebut = new ButtonBuilder()
                    .setCustomId(`SETUP_PLAY_PAUSE_BUTTON`)
                    .setEmoji(`${client.emoji.pause}`)
                    .setStyle(2)
                    .setDisabled(disabled)

                    let skipbut = new ButtonBuilder()
                    .setCustomId(`SETUP_SKIP_BUTTON`)
                    .setEmoji(`${client.emoji.skip}`)
                    .setStyle(2)
                    .setDisabled(disabled)

                    let highvolumebut = new ButtonBuilder()
                    .setCustomId(`SETUP_VOL_UP_BUTTON`)
                    .setEmoji(`${client.emoji.volumeup}`)
                    .setStyle(2)
                    .setDisabled(disabled)

                    const row1 = new ActionRowBuilder().addComponents(lowvolumebut, stopbut, pausebut, skipbut, highvolumebut);

                    let embed2 = new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Currently playing [${queue.currentTrack.title}](${queue.currentTrack.url}) by ${author}`)
                    .setURL(queue.currentTrack.url)
                    .setImage(icon);
                    const embedcontent2 = new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Join a voice channel and queue songs by name/url.`)
                    await message.edit({
                        files: [],
                        embeds: [embedcontent2, embed1, embed2],
                        components: [row1]
                    });
                } else return
            }
        } else {
            if (data && data.channel && data.message) {
                let guildId = client.guilds.cache.get(data._id)
                let textChannel = guildId.channels.cache.get(data.channel);

                let message;
                try {

                    message = await textChannel.messages?.fetch(data.message, { cache: true, force: true });

                } catch (error) { };

                if (!message) return;

                let disabled = true;
                if (queue && queue.currentTrack) disabled = false;

                const imgs = readdirSync("./Assets/img/").filter(c => c.split('.').pop() === 'png');

                let img = imgs[Math.floor(Math.random() * imgs.length)];

                let file = new AttachmentBuilder(`./Assets/img/${img}`, `${img}`).setName(`Zeon-Music-Banner.png`)

                let embed2 = new EmbedBuilder().setColor(color).setTitle("**Join a voice channel and queue songs by name/url**",).setDescription(`[Invite](${client.config.Bot.Invite}) ~ [Support Server](${client.config.Bot.SupportServer})`).setFooter({ text: `Thank you for using ${client.user.username}`, iconURL: client.user.displayAvatarURL() }).setImage("https://i.ibb.co/D9SRhHP/Music.png");

                let lowvolumebut = new ButtonBuilder()
                .setCustomId(`SETUP_VOL_DOWN_BUTTON`)
                .setEmoji(`${client.emoji.volumedown}`)
                .setStyle(2)
                .setDisabled(disabled)

                let stopbut = new ButtonBuilder()
                .setCustomId(`SETUP_STOP_BUTTON`)
                .setEmoji(`${client.emoji.stop}`)
                .setStyle(2)
                .setDisabled(disabled)

                let pausebut = new ButtonBuilder()
                .setCustomId(`SETUP_PLAY_PAUSE_BUTTON`)
                .setEmoji(`${client.emoji.pause}`)
                .setStyle(2)
                .setDisabled(disabled)

                let skipbut = new ButtonBuilder()
                .setCustomId(`SETUP_SKIP_BUTTON`)
                .setEmoji(`${client.emoji.skip}`)
                .setStyle(2)
                .setDisabled(disabled)

                let highvolumebut = new ButtonBuilder()
                .setCustomId(`SETUP_VOL_UP_BUTTON`)
                .setEmoji(`${client.emoji.volumeup}`)
                .setStyle(2)
                .setDisabled(disabled)

                const row1 = new ActionRowBuilder().addComponents(lowvolumebut, stopbut, pausebut, skipbut, highvolumebut);
                
                await message.edit({
                    files: [file],
                    content: null,
                    embeds: [embed2],
                    components: [row1]
                });

            }
        }

    } catch (error) {
        return console.error(error);
    }
}

function parseTime(string) {
    const time = string.match(/([0-9]+[d,h,m,s])/g);
    if (!time) return 0;
    let ms = 0;
    for (const t of time) {
        const unit = t[t.length - 1];
        const amount = Number(t.slice(0, -1));
        if (unit === 'd') ms += amount * 24 * 60 * 60 * 1000;
        else if (unit === 'h') ms += amount * 60 * 60 * 1000;
        else if (unit === 'm') ms += amount * 60 * 1000;
        else if (unit === 's') ms += amount * 1000;
    }
    return ms;
}

async function sendMessage(guild, content, type) {
    const exactlogdb = await logdb.findOne({ Guild: guild.id });

    if (!exactlogdb) return

    let realtype;

    if (type === "channelLogs") realtype = exactlogdb.channelLogs;
    else if (type === "emojiLogs") realtype = exactlogdb.emojiLogs;
    else if (type === "guildBanLogs") realtype = exactlogdb.guildBanLogs;
    else if (type === "guildMemberLogs") realtype = exactlogdb.guildMemberLogs;
    else if (type === "guildRoleLogs") realtype = exactlogdb.guildRoleLogs;
    else if (type === "guildScheduledEventLogs") realtype = exactlogdb.guildScheduledEventLogs;
    else if (type === "inviteLinkLogs") realtype = exactlogdb.inviteLinkLogs;
    else if (type === "messageLogs") realtype = exactlogdb.messageLogs;
    else if (type === "stickerLogs") realtype = exactlogdb.moderationLogs;
    else if (type === "stageLogs") realtype = exactlogdb.serverLogs;
    else if (type === "threadLogs") realtype = exactlogdb.threadLogs;
    else if (type === "voiceStateLogs") realtype = exactlogdb.voiceLogs;
    else if (type === "webhookLogs") realtype = exactlogdb.webhookLogs;
    else return console.log(`[Audit Logger] Invalid Type.`);

    if (!realtype.enabled) return;

    const channel = await guild.channels.cache.get(realtype.channel) || await guild.channels.fetch(realtype.channel);

    if (!channel) console.log(`[Audit Logger] Unable to find Log Channel.`);

    const guildMember = await guild.members.cache.get(channel.client.user.id) || await guild.members.fetch(channel.client.user.id);

    const perms = channel.permissionsFor(guildMember);
    if (!perms.has(PermissionsBitField.Flags.ManageWebhooks)) return console.log(`[Audit Logger] Missing Some Permissions For Log Channel. [Missing Permission: Manage Webhooks]`);

    const webhooks = await channel.fetchWebhooks();

    let webhook = webhooks.find(x => x.name === `Audit Logger | Zeon` && x.owner.id === channel.client.user.id);

    if (!webhook) {
        webhook = await channel.createWebhook({
            name: `Audit Logger | Zeon`,
            avatar: channel.client.user.displayAvatarURL(),
            reason: `Audit Logger | Zeon`
        });
    }

    if (!webhook) return console.log(`[Audit Logger] Unable to find Webhook.`);

    return webhook.send(content)
}

module.exports = { CapitalizeText, GetChoicesCommand, convertTime, updateQueue, chunk, parseTime, sendMessage }