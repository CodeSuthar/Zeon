const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets The Volume Of The Music Player.")
    .addIntegerOption((option) => option
        .setName("volume")
        .setDescription("Sets The Volume Of The Music Player.")
        .setRequired(true)
    ),
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
    
        const amount = interaction.options.getInteger("volume");
    
        if (amount < 0 || amount > 150) {
            const embed = new EmbedBuilder()
            .setDescription(`You Need To Give An Amount Between 0 And 150 To Set Volume!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] }) 
        }
        
        try {
            let embed;
            const volumeup = client.emoji.volumeup;
            const volumedown = client.emoji.volumedown;
    
            if (Queue.node.volume < amount) {
                embed = new EmbedBuilder()
	    		      .setColor("Random")
	    		      .setDescription(`${volumeup} Volume has been set to **${amount}%**`)
            }
    
            if (Queue.node.volume > amount) {
                embed = new EmbedBuilder()
	    	        .setColor("Random")
	    		      .setDescription(`${volumedown} Volume has been set to **${amount}%**`)
            }
    
            await Queue.node.setVolume(amount);
            return interaction.editReply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            return interaction.editReply({ content: `Can't Set The Volume` })
        }
    }
}