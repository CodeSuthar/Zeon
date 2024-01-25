const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode, useQueue, useMainPlayer } = require('discord-player');
const { updateQueue } = require("../../../Utils/Utils.js")

const repeatModes = {
    off: QueueRepeatMode.OFF,
    track: QueueRepeatMode.TRACK,
    queue: QueueRepeatMode.QUEUE
};

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loops the current playing track or the entire queue.')
    .addStringOption(option =>
        option.setName('mode')
        .setDescription('Choose a loop mode.')
        .setRequired(true)
        .addChoices(
            {
                name: 'Off',
                value: 'off'
            },
            {
                name: 'Track',
                value: 'track'
            },
            {
                name: 'Queue',
                value: 'queue'
            }
        )
    ),
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
            .setDescription(`${client.emoji.wrong} | There's No Player To Clear Queue In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Track Playing To Loop In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        const modeName = interaction.options.getString('mode', true);
        const modeValue = repeatModes[modeName.toLowerCase()];

        const mode = modeName === 'track' ? `Loop track mode on ${client.emoji.looptrack}` : modeName === 'queue' ? `Loop queue mode on ${client.emoji.loopqueue}` : `Loop mode off ${client.emoji.loopoff}`;

        const loopembed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setColor('#FF0000')
        .setTitle(mode)
        .setDescription(`The loop mode has been set to ${modeName}!`)
        .setTimestamp()
        .setFooter({
            text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        });

        try {
            await Queue.setRepeatMode(modeValue);
            await interaction.editReply({ embeds: [loopembed] });
            return await updateQueue(client, Queue, interaction.guild);
        } catch (e) {
            console.log(e);
            interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Set Or Disable Loop, Anytime Now! Try Again Later.`})
        }
    },
};