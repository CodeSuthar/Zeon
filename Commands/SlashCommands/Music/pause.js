const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause The Current Track"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const Player = await useMainPlayer();

        const Queue = await useQueue(interaction.guildId);

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
            .setDescription(`${client.emoji.wrong} | There's No Player To Pause In This Server!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Track Playing To Pause In This Server!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (Queue.node.isPaused()) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | The Player Is Already Paused!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        const Information = await Player.getNowPlayingMessage(interaction.guild.id);

        if (Information) {
            const QueueData = Queue.metadata;

            const channel = await interaction.guild.channels.cache.get(QueueData.channel) || await interaction.guild.channels.fetch(QueueData.channel);
            const track = Queue.currentTrack;

            const DecisionEmbed = new EmbedBuilder()
            .setAuthor({ name: "|  Paused", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`[${track.title}](${track.url})`)
            .addFields(
                {
                    name: "Duration",
                    value: `\`[ ${track.duration} ]\``,
                    inline: true
                },
                {
                    name: "Requester",
                    value: `\`[ ${track.requestedBy.username} | ${track.requestedBy.id} ]\``,
                    inline: true
                }
            )
            .setThumbnail(track.thumbnail)
            .setTimestamp()
            .setColor("Random")

            if (channel) channel.messages.edit(Information, {
                embeds: [DecisionEmbed]
            });
        }

        await Queue.node.setPaused(true);

        const embed = new EmbedBuilder()
        .setDescription(`${client.emoji.tick} | Paused - [${Queue.currentTrack.title}](${Queue.currentTrack.url})!`)
        .setColor("Random")

        return interaction.editReply({ embeds: [embed] });
    }
};