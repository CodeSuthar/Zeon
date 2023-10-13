const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const lyricsfinder = require("lyrics-finder");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get The Lyrics Of The Current Track Or The Track You Want!")
    .addStringOption(option => option.setName("song").setDescription("The Song Name To Get The Lyrics Of")),    
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const Player = await useMainPlayer();

        const Queue = await useQueue(interaction.guildId);

        const value = interaction.options.getString("song");

        let song = value;
        let CurrentSong = Queue.currentTrack;

        if (!song && !Queue) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Player To Get The Lyrics Of In This Server!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (!song && !CurrentSong) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Track Playing To Get The Lyrics Of In This Server!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (!song && CurrentSong) song = CurrentSong.title;

        let author = CurrentSong ? CurrentSong.author : "";

        if (!author) author = "";
        
        let lyrics = null;

        try {
            lyrics = await lyricsfinder(author, song);

            if (!lyrics) {
                const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | No Lyrics Found For This Song!`)
                .setColor("Random")

                return interaction.editReply({ embeds: [embed] })
            }

            const lyricEmbed = new EmbedBuilder()
            .setTitle(`Lyrics For ${song}`)
            .setDescription(`${lyrics}`)
            .setColor("Random")

            if (lyrics.length > 4096) {
                lyricEmbed.setDescription(`${client.emoji.wrong} | The Lyrics Are Too Long To Be Displayed!`)
                .setColor("Random")
            }

            return interaction.editReply({ embeds: [lyricEmbed] })
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Fetch The Lyrics Data, Anytime Now! Try Again Later.` });
        }
    }
};

/* const Command = require('../../structures/Command');
const lyricsfinder = require("lyrics-finder");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")

module.exports = class Lyrics extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      description: {
        content: 'Displays the lyrics of the song.',
        usage: 'lyrics <song name>',
        examples: []
      },
      category: 'music',
      cooldown: 6,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: ["DeafenMembers"],
      },
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      options: [
        {
            name: "song",
            description: "Search lyrics for a specific song.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    });
  }
  async run(client, interaction) {
    await interaction.deferReply({ ephemeral: false });

    const player = client.player.players.get(interaction.guildId);
    const value = interaction.options.getString("song");

    let song = value;
    let CurrentSong = player.queue.current;
    if (!song && CurrentSong) song = CurrentSong.title;

    let lyrics = null;

    const lyricError = new EmbedBuilder().setDescription(`${client.config.emojis.error} There is nothing playing.`).setColor('#ff0080');;

    try {
        lyrics = await lyricsfinder(song, "");
        if (!lyrics)
            return interaction.editReply({ embeds: [lyricError] }).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 12000);
            });
    } catch (err) {
        console.log(err);
        return interaction.editReply({ embeds: [lyricError] }).then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 12000);
        });
    }

    const lyricEmbed = new EmbedBuilder()
        .setTitle(`Lyrics for ${song}`)
        .setDescription(`${lyrics}`)
        .setColor('#ff0080');

    if (lyrics.length > 4096) {
        lyricEmbed.setDescription(`${client.config.emojis.error} The lyrics are too long to be displayed.`).setColor('#ff0080');;
        //lyricEmbed.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
    }

    return interaction.editReply({ embeds: [lyricEmbed] });
}
}; */