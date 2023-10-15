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