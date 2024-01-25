const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const db = require("../../../Database/Music247.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("247")
    .setDescription("Sets The Player To 24/7 Mode."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let data = await db.findOne({ _id: interaction.guildId });

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

        let vc = interaction.member.voice.channel;

        try {
            if (!Queue) {
                Queue = await Player.nodes.create(interaction.guild, {
                    leaveOnEnd: false,
                    leaveOnStop: false,
                    leaveOnEmpty: false,
                    volume: 80,
                    bufferingTimeout: 200,
                    selfDeaf: true,
                    metadata: {
                        guild: interaction.guild.id,
                        channel: interaction.channel.id,
                    }
                });

                if (!Queue.connection) Queue.connect(vc);
            }

            //Now Use The Codes From Comments Below
            if (!data) {
                data = new db({
                    _id: interaction.guildId,
                    mode: true,
                    textChannel: interaction.channelId,
                    voiceChannel: interaction.member.voice.channelId,
                    moderator: interaction.user.id,
                    lastUpdated: Math.round(Date.now() / 1000)
                });
                await data.save();
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.tick} | 24/7 mode is now **enabled**.`)

                return await interaction.editReply({ embeds: [embed] });
            } else {
                if (data.mode) {
                    data.mode = false;
                    data.textChannel = null;
                    data.voiceChannel = null;
                    data.moderator = interaction.user.id;
                    data.lastUpdated = Math.round(Date.now() / 1000);
                    await data.save();
                    const embed1 = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.tick} | 24/7 mode is now **disabled**.`)

                    return await interaction.editReply({ embeds: [embed1] });
                } else {
                    data.mode = true;
                    data.textChannel = interaction.channelId;
                    data.voiceChannel = interaction.member.voice.channelId;
                    data.moderator = interaction.user.id;
                    data.lastUpdated = Math.round(Date.now() / 1000);

                    await data.save();
                    const embed2 = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.tick} | 24/7 mode is now **enabled**.`)

                    return await interaction.editReply({ embeds: [embed2] });
                }
            }
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Set 24/7 Mode, Anytime Now! Try Again Later.` });
        }
    }
};