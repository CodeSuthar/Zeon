const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { useMainPlayer, useQueue } = require("discord-player")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("fixvoice")
    .setDescription("Fixes Music Voice Issues."),
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
            .setDescription(`There's No Player To Fix Voice Issues In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        const voice = interaction.guild.channels.cache.get(Queue.channel.id);

        if (!voice) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | I Can't Find The Voice Channel To Fix Voice Issues!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }

        if (voice.rtcRegion !== "sydney") {
            await voice.edit({ rtcRegion: "automatic" }).catch(() => { });
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.tick} | Fixed Voice Issues!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.tick} | You Are Already On My Best Sound Quality!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }
    }
};