const { PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const db = require("../../Database/MusicSetup.js");
const { chunk } = require("../../Utils/Utils.js");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        let data = await db.findOne({ _id: message.guildId });
        if (data && data.channel && message.channelId === data.channel) {
            let color = "#050f39";
            let fail = client.emoji.wrong;

            if (message.author.bot) return;

            if(!message.member.voice.channel) {
                await oops(message.channel, `You are not connected to a voice channel to queue songs.`, color, fail);
                if(message) await message.delete().catch(() => {});
                return;
            };

            if (!message.member.voice.channel.permissionsFor(client.user).has([PermissionFlagsBits.Speak, PermissionFlagsBits.Connect])) {
                await oops(message.channel, `I don't have enough permission to connect/speak in ${message.member.voice.channel}`);
                if(message) await message.delete().catch(() => {});
                return;
            }

            if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId !== message.member.voice.channelId) {
                await oops(message.channel, `You are not connected to <#${message.guild.members.me.voice.channelId}> to queue songs`, color, fail);
                if(message) await message.delete().catch(() => {});
                return;
            }

            let Player = await useMainPlayer();

            let Queue = await useQueue(message.guildId);

            const vc = message.member.voice.channel;

            if (!Queue) Queue = await Player.nodes.create(message.guild, {
                leaveOnEnd: false,
                leaveOnStop: false,
                leaveOnEmpty: false,
                volume: 80,
                bufferingTimeout: 200,
                selfDeaf: true,
                metadata: {
                    guild: message.guild.id,
                    channel: message.channel.id
                }
            });

            if (!Queue.connection) Queue.connect(vc);

            await playerhandler(client, `${message.content}`, Player, Queue, message, color, db, fail);
            if (message) await message.delete().catch(() => {});
        }
    }
}

async function oops(channel, args, color, emoji) {
    try {
        let embed1 = new EmbedBuilder().setColor(color).setDescription(`${emoji} | ${args}`);
  
        const m = await channel.send({
            embeds: [embed1]
        });
  
        setTimeout(async () => await m.delete().catch(() => { }), 12000);
    } catch (e) {
        return console.error(e)
    }
};

async function qeb(client, embed, queue) {
    let author = queue.currentTrack.author ? queue.currentTrack.author : 'Unknown';
    let map = queue.tracks.map((x, i) => `**${i + 1}.** ${x.title && x.url ? `[${x.title}](${x.url})` : `${x.title}`}`);
    let pages = chunk(map, 2).map((x) => x.join("\n"));
    let page = 0;
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
    return embed.addFields(fields)
};

function neb(embed, queue, client) {
    const author = queue.currentTrack.author ? queue.currentTrack.author : 'Unknown';
  
    let icon = queue.currentTrack.thumbnail ? queue.currentTrack.thumbnail : client.user.displayAvatarURL();
    return embed.setColor("#050f39").setDescription(`Currently playing [${queue.currentTrack.title}](${queue.currentTrack.url}) by ${author}`).setURL(queue.currentTrack.url).setImage(icon);
};

async function playerhandler(client, query, player, queue, message, color, setupSchema, emoji) {
    let m;
    let d = await setupSchema.findOne({ _id: message.guildId });
    let q = new EmbedBuilder().setTitle("Queue statistics").setColor(color);
    let n = new EmbedBuilder().setColor(color);
  
    try {
        if (d) m = await message.channel.messages.fetch({ message: d.message, cache: true, force: true });
    } catch (e) { };

    if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(query)) {
        return await oops(message.channel, "Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Zeon's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.", color, emoji);
    }
    
    let res = await player.search(`${query}`, {
        requestedBy: message.author
    });

    if (!res || !res.tracks) return await oops(message.channel, "No results found.", color, emoji);

    if (res.playlist) {
        for (let track of res.tracks) {
            if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(track.url)) {
                return await oops(message.channel, "Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Zeon's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.", color, emoji);
            }

            await queue.addTrack(track);
        }

    if (!queue.node.isPlaying()) await queue.node.play();

    let embed = new EmbedBuilder()
        .addFields(
            {
                name: `Playlist Name`,
                value: `\`[ ${res.playlist.title} ]\``,
                inline: true
            },
            {
                name: `Playlist Duration`,
                value: `\`[ ${res.playlist.durationFormatted} ]\``,
                inline: true
            },
            {
                name: `Playlist Tracks Count`,
                value: `\`[ ${res.tracks.length} ]\``,
                inline: true
            },
            {
                name: `Requester`,
                value: `\`[ ${message.author.username} | ${message.author.id} ]\``,
                inline: true
            }
        )
        .setThumbnail(res.playlist.thumbnail)
        .setTimestamp()
        .setColor(color)

        await message.channel.send({ embeds: [embed], content: `${client.emoji.tick} | Playlist added to queue!` }).then(async (a) => setTimeout(async () => await a.delete().catch(() => { }), 5000)).catch(() => { });

        await qeb(client, q, queue);
        await neb(n, queue, client);

        if (m) await m.edit({ embeds: [q, n], files: [] }).catch(() => { });
    } else {
        const track = res.tracks[0];

        if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(track.url)) {
            return await oops(message.channel, "Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Zeon's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.", color, emoji);
        }

        await queue.addTrack(track);

        if (!queue.node.isPlaying()) await queue.node.play();

        let embed = new EmbedBuilder()
        .setColor(color)
        .addFields(
            {
                name: `Song Name`,
                value: `\`[ ${track.title} ]\``,
                inline: true
            },
            {
                name: `Song Duration`,
                value: `\`[ ${track.duration} ]\``,
                inline: true
            },
            {
                name: `Requester`,
                value: `\`[ ${message.author.username} | ${message.author.id} ]\``,
                inline: true
            }
        )
        .setThumbnail(track.thumbnail)
        .setTimestamp()

        await message.channel.send({ embeds: [embed], content: `${client.emoji.tick} | Track added to queue!` }).then(async (a) => setTimeout(async () => await a.delete().catch(() => { }), 5000)).catch(() => { });

        await qeb(client, q, queue);
        await neb(n, queue, client);

        let lowvolumebut = new ButtonBuilder()
        .setCustomId(`SETUP_VOL_DOWN_BUTTON`)
        .setEmoji(`${client.emoji.volumedown}`)
        .setStyle(2)

        let stopbut = new ButtonBuilder()
        .setCustomId(`SETUP_STOP_BUTTON`)
        .setEmoji(`${client.emoji.stop}`)
        .setStyle(2)

        let pausebut = new ButtonBuilder()
        .setCustomId(`SETUP_PLAY_PAUSE_BUTTON`)
        .setEmoji(`${client.emoji.pause}`)
        .setStyle(2)

        let skipbut = new ButtonBuilder()
        .setCustomId(`SETUP_SKIP_BUTTON`)
        .setEmoji(`${client.emoji.skip}`)
        .setStyle(2)

        let highvolumebut = new ButtonBuilder()
        .setCustomId(`SETUP_VOL_UP_BUTTON`)
        .setEmoji(`${client.emoji.volumeup}`)
        .setStyle(2) 

        const row1 = new ActionRowBuilder().addComponents(lowvolumebut, stopbut, pausebut, skipbut, highvolumebut);

        if (m) await m.edit({ embeds: [q, n], components: [row1], files: [] }).catch(() => { });
    }
};