const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("grab")
    .setDescription("Grabs and sends you the Song details that is playing at the Moment"),
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
            .setDescription(`There's No Player To Grab Current Song Details In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`There's No Song Playing To Grab The Details!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        const song = Queue.currentTrack;

        const total = song.duration;

        const user = await client.users.cache.get(interaction.member.user.id) || await client.users.fetch(interaction.member.user.id);

        const urlbutt = new ButtonBuilder().setLabel("Search").setStyle(ButtonStyle.Link).setURL(song.url);
        const row2 = new ActionRowBuilder().addComponents(urlbutt);

        let embed = new EmbedBuilder()
        .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.url}) \n > **__Song Duration__**: \`[${song.duration}]\` \n > **__Song Played By__**: [<@${song.requestedBy.id}>] \n > **__Song Saved By__**: [<@${interaction.user.id}>]`)
        .setThumbnail(song.thumbnail)
        .setColor("Random")
        .addFields(
            {
                name: "\u200b",
                value: `\`[ ${song.duration} ]\``
            }
        )

        await user.send({embeds: [embed], components: [row2]});

        const dmbut = new ButtonBuilder().setLabel("Check Your DM").setStyle(ButtonStyle.Link).setURL(`https://discord.com/users/${client.user.id}`);
        const row = new ActionRowBuilder().addComponents(dmbut);

        let dm = new EmbedBuilder()
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
        .setDescription(`:mailbox_with_mail: \`Check Your DMs!\``)
        .setColor("Random")

        interaction.editReply({embeds: [dm], components: [row]});
    }
};

/* 
const { EmbedBuilder, CommandInteraction, Client, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');

module.exports = {
  name: "grab",
  description: "Grabs and sends you the Song that is playing at the Moment",
  userPrems: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  run: async (client, interaction) => {
    let player = interaction.client.manager.get(interaction.guildId);
    const song = player.queue.current
    const total = song.duration;
    const current = player.position;

    const dmbut = new ButtonBuilder().setLabel("Check Your DM").setStyle(ButtonStyle.Link).setURL(`https://discord.com/users/${client.id}`)
    const row = new ActionRowBuilder().addComponents(dmbut)

    let dm = new EmbedBuilder()
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
    .setDescription(`:mailbox_with_mail: \`Check Your DMs!\``)
    .setColor(client.embedColor)
    .setFooter({text: `Requested By ${interaction.user.tag}`})
    .setTimestamp()
    interaction.reply({embeds: [dm], components: [row]})
    const user = client.users.cache.get(interaction.member.user.id);
    const urlbutt = new ButtonBuilder().setLabel("Search").setStyle(ButtonStyle.Link).setURL(song.uri)
    const row2 = new ActionRowBuilder().addComponents(urlbutt)
    let embed = new EmbedBuilder()
        .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.uri}) \n > **__Song Duration__**: \`[${convertTime(song.duration)}]\` \n > **__Song Played By__**: [<@${song.requester.id}>] \n > **__Song Saved By__**: [<@${interaction.user.id}>]`)
        .setThumbnail(song.displayThumbnail())
        .setColor(client.embedColor)
        .addFields([
            { name: "\u200b", value: `\`${convertTime(current)} / ${convertTime(total)}\`` }
        ])
     return user.send({embeds: [embed], components: [row2]})

   }
}; */