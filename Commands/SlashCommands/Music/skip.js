const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips The Current Playing Track."),
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
            const embed = new EmbedBuilder()
            .setDescription(`There's No Player To Skip Track In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Track Playing To Skip!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }

        try {
            const skip = client.emoji.skip;
            const embed = new EmbedBuilder()
            .setDescription(`${skip} | Skipped The Current Track`)
            .setColor("Random")
            Queue.node.skip();
            return interaction.editReply({ embeds: [embed] })
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Skip The Track, Anytime Now! Try Again Later.` });
        }
    }
};