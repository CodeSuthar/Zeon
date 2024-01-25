const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const { Spotify } = require("canvafy");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Shows Current Track Information"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guildId);
    
        if (!Queue) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Player To Show Now Playing In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Track Playing In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }
    
        try {
            const spotify = await new Spotify()
            .setAuthor(Queue.currentTrack.author)
            .setImage(Queue.currentTrack.thumbnail)
            .setTimestamp(Queue.node.getTimestamp(true).current.value + 1000, Queue.node.totalDuration)
            .setTitle(Queue.currentTrack.title)
            .build();
          
            let embed = new EmbedBuilder()
            .addFields(
                { name: `Now Playing:-`, value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) - <@${Queue.currentTrack.requestedBy.id}>` },
                { name: "\u200b", value: `${Queue.node.createProgressBar({ length: 8 })}` }
            )
            .setImage(`attachment://spotify-${interaction.member.id}.png`)
            .setColor("Random")
          
            return interaction.editReply({ embeds: [embed], files: [
                  {
                    attachment: spotify,
                    name: `spotify-${interaction.member.id}.png` 
                  }
              ] 
            })
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Fetch The Now Playing Data, Anytime Now! Try Again Later.` });
        }
    }
};