const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play your favourite songs.")
    .addStringOption((option) => option
        .setName("song")
        .setDescription("The Song Name Or Link You Want To Play.")
        .setRequired(true)
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | You Need To Be Connected To A Voice Channel To Use This Command!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (Queue && Queue.channel.id !== interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | I'm Connected To <#${Queue.channel.id}> Voice Channel, You Need To Be In The Same Channel As Me To Control Me!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (!Queue) {
            const vc = interaction.member.voice.channel;
            Queue = await Player.nodes.create(interaction.guild, {
                leaveOnEnd: false,
                leaveOnStop: false,
                leaveOnEmpty: false,
                volume: 80,
                bufferingTimeout: 200,
                selfDeaf: true,
                metadata: {
                    guild: interaction.guild.id,
                    channel: interaction.channel.id
                }
            });

            if (!Queue.connection) Queue.connect(vc);
        }

        const searchQuery = interaction.options.getString("song");

        let searchResult;
        searchResult = await Player.search(searchQuery, {
            requestedBy: interaction.user
        });

        if (!searchResult || !searchResult.tracks.length) return interaction.editReply({ content: 'No results were found!' });

        try {
            if (searchResult.playlist) {
                await interaction.editReply({ content: `${client.emoji.loading} | Loading Playlist... • ${searchResult.playlist.title} • ${searchResult.playlist.length + 1}` })
                let count = 0;
            
                for (const track of searchResult.tracks) {
                    if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(track.url)) {
                        const yemb = new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Zeon's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.`)
                        return interaction.editReply({ embeds: [yemb] })
                    }

                    Queue.addTrack(track);
                    count++;
                }

                if (!Queue.node.isPlaying()) Queue.node.play();

                const embed = new EmbedBuilder()
                .addFields(
                    {
                        name: `Playlist Name`,
                        value: `\`[ ${searchResult.playlist.title} ]\``,
                        inline: true
                    },
                    {
                        name: `Playlist Duration`,
                        value: `\`[ ${searchResult.playlist.durationFormatted} ]\``,
                        inline: true
                    },
                    {
                        name: `Playlist Tracks Count`,
                        value: `\`[ ${count} ]\``,
                        inline: true
                    },
                    {
                        name: `Requester`,
                        value: `\`[ ${interaction.user.username} | ${interaction.user.id} ]\``,
                        inline: true
                    }
                )
                .setThumbnail(searchResult.playlist.thumbnail)
                .setTimestamp()
                .setColor("Random")

                return interaction.editReply({ embeds: [embed], content: `${client.emoji.musicalnote} | Playlist added to queue!` })
            } else {
                if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(searchResult.tracks[0].url)) {
                    const yemb = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Zeon's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.`)
                    return interaction.editReply({ embeds: [yemb] })
                }

                Queue.addTrack(searchResult.tracks[0]);

                if (!Queue.node.isPlaying()) Queue.node.play();

                const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.musicalnote} | Track added to queue! • [${searchResult.tracks[0].title}](${searchResult.tracks[0].url})`)
                .addFields(
                    {
                        name: `Track Duration`,
                        value: `\`[ ${searchResult.tracks[0].duration} ]\``,
                        inline: true
                    },
                    {
                        name: `Requester`,
                        value: `\`[ ${interaction.user.username} | ${interaction.user.id} ]\``,
                        inline: true
                    }
                )
                .setThumbnail(searchResult.tracks[0].thumbnail)
                .setColor("Random")
            
                return interaction.editReply({ embeds: [embed] })
            }
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Play The Music In The Voice Channel, Anytime Now! Try Again Later.` });
        }
    }
}