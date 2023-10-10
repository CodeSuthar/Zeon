const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves The Connected Voice Channel"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guildId);
        
        if (!interaction.member.voice.channelId) {
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
            const embed = new EmbedBuilder()
            .setDescription(`There's No Player In The Guild`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        try {
           const leave = client.emoji.leave;
      
            const embed = new EmbedBuilder()
            .setDescription(`${leave} Disconnected From <#${Queue.channel.id}> Sucessessfully`)
            .setColor("Random")
            if (Queue) Queue.delete();
            return interaction.editReply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
        }
    }
}