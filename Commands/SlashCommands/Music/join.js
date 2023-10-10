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

    if (Queue && Queue.channel.id === interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`We Are In A Same Voice Channel, Dumbo!`)
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
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                }
            });

            Queue.connect(vc)
        } else if (Queue && !Queue.connection) {
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
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                }
            });

            Queue.connect(vc);
        }
        const embed = new EmbedBuilder()
          .setDescription(`${join} Joined A Voice Channel ${vc} Sucessfully, And Tied To ${interaction.channel}`)
          .setColor("Random")
        return interaction.editReply({ embeds: [embed] });
      } catch (e) {
        console.log(e)
      }
    }
  }
}