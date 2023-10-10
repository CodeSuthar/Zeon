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
            .setDescription("You Are Not Connected To A Voice Channed!")
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }

        if (Queue && Queue.channel.id !== interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
            .setDescription(`I'm Connected To <#${Queue.channel.id}> Voice Channel, I Can't Betray <#${Queue.channel.id}> By Listening Your Command, Join My Voice Channel To Use Me!`)
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
                    channel: interaction.channel.id,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
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
            if (!searchResult || !searchResult.tracks.length) return interaction.editReply({ content: 'No results were found!' });

            if (searchResult.playlist) {
                let count = 0;
            
                for (const track of searchResult.tracks) {
                    if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(track.url)) {
                        const yemb = new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Reverb's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.`)
                        return interaction.editReply({ embeds: [yemb] })
                    }

                    Queue.addTrack(track);
                    count++;
                }

                if (!Queue.node.isPlaying()) Queue.node.play();

                const embed = new EmbedBuilder()
                .setAuthor({ name: `Loaded Your Playlist`, iconURL: `https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-icon-marilyn-scott-0.png` })
                .setDescription(`Added ${count} Tracks To Queue`)
                .setFooter({ text: `Requested By ${interaction.user.tag}` })
                .setColor("Random")

                return interaction.editReply({ embeds: [embed], content: `🎶 Loaded You Playlist` })
            } else {
                if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(searchResult.tracks[0].url)) {
                    const yemb = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`Unfortunately, due to recent demand from both Discord and Youtube, we have disabled the bot's ability to play YouTube URLs. This is a tremendous disappointment for everyone, including Reverb's team, however it is likely that this will be a permanent modification to prevent the bot from being unverified. We really regret any inconvenience and aim to have more alternative choices accessible in the near future.`)
                    return interaction.editReply({ embeds: [yemb] })
                }

                Queue.addTrack(searchResult.tracks[0]);

                if (!Queue.node.isPlaying()) Queue.node.play();

                const embed = new EmbedBuilder()
                .setAuthor({ name: "Added To Queue" })
                .setDescription(`[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})`)
                .setColor("Random")
                .setFooter({ text: `Requested By ${interaction.user.tag}` })
            
                return interaction.editReply({ embeds: [embed] })
            }
        } catch (e) {
            console.log(e)
            return interaction.editReply({ content: `Can't Load The Track, Try Again One More Time!` })
        }
    }
}