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
        
        if (!interaction.member.voice.channel) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | You Need To Be Connected To A Voice Channel To Use This Command!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }

        if (Queue && Queue.channel.id !== interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | I'm Already Connected To <#${Queue.channel.id}> Voice Channel, I Can't Betray <#${Queue.channel.id}> By Listening Your Command, Join My Voice Channel To Use Me!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }

        if (!Queue) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Player To Destroy In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        try {
           const leave = client.emoji.leave;
      
            const embed = new EmbedBuilder()
            .setDescription(`${leave} | Disconnected From <#${Queue.channel.id}> Successfully`)
            .setColor("Random")
            if (Queue) Queue.delete();
            return interaction.editReply({ embeds: [embed] })
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Leave The Voice Channel, Anytime Now! Try Again Later.` });
        }
    }
}