const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const { parseTime } = require("../../../Utils/Utils.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seeks to a certain time in the song")
    .addStringOption(option =>
        option.setName('time')
        .setDescription('The time to seek to')
        .setRequired(true)
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
            .setDescription(`${client.emoji.wrong} | There's No Player To Seek In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Track Playing To Seek In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        const time = parseTime(interaction.options.getString("time"));

        if (!time) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | Invalid Time Format!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        try {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.tick} | Seeked To \`${time}\`!`)
            .setColor("Random")
            
            await Queue.node.seek(time);

            return await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Seek, Anytime Now! Try Again Later.` });
        }
    }
};