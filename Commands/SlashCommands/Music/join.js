const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Bot Join Your Voice Channel."),
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

        if (Queue && Queue.channel.id === interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | We Are Already In The Same Voice Channel, Dumbo!`)
                .setColor("Random")
            return interaction.editReply({ embeds: [embed] })
        }

        const vc = interaction.member.voice.channel;

        if (!Queue) {
            try {
                const join = client.emoji.join;

                if (!Queue) {
                    Queue = await Player.nodes.create(interaction.guild, {
                        leaveOnEnd: false,
                        leaveOnStop: false,
                        leaveOnEmpty: false,
                        initialVolume: 80,
                        bufferingTimeout: 200,
                        selfDeaf: true,
                        metadata: {
                            guild: interaction.guild.id,
                            channel: interaction.channel.id,
                        }
                    });

                    if (!Queue.connection) Queue.connect(vc)
                }

                const embed = new EmbedBuilder()
                    .setDescription(`${join} | Joined The Channel ${vc} Successfully, And Got Bounded To ${interaction.channel}`)
                    .setColor("Random")

                return interaction.editReply({ embeds: [embed] });
            } catch (e) {
                console.log(e);
                return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Join The Voice Channel, Anytime Now! Try Again Later.` });
            }
        }
    }
}