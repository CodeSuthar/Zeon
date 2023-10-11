const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const load = require('lodash');
const { useMainPlayer, useQueue } = require("discord-player");
const { convertTime } = require("../../../Handler/Bot-Function-Extended/Utils.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows You The Music Player Queue"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guildId);
    
        if (!Queue) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Player To Show The Queue In This Server!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })  
        }

        if (!Queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setDescription(`There's No Track Playing To Show You Queue In This Server!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })  
        }
    
        try {
            if (!Queue.tracks.size) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.guild.name}'s Queue`, iconURL: interaction.guild.iconURL() })
                .addFields(
                    { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                    { name: "Queued Tracks", value: "There Are No Queued Track To Show Here" }
                )
                .setColor("Random")
                return interaction.editReply({ embeds: [embed] })
            }

            const queuedTracks = Queue.tracks.map((m, i) => 
                `\` ${++i} \` • ${m.title} • \`[ ${m.duration} ]\` • [${m.requestedBy}]`
            );

            const trackpoint = load.chunk(queuedTracks, 10);
            let queuedList = 0;
            const Page = trackpoint.map((s) => s.join('\n'))
      
            if (Queue.tracks.size > 11) {
                const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.guild.name}'s Queue`, iconURL: interaction.guild.iconURL() })
                .addFields(
                    { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                    { name: "Queued Tracks", value: `${Page[queuedList]}` },
                )
                .setColor("Random")
                .setFooter({ text: `Page:- ${queuedList + 1}/${Page.length}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
  
                const but1 = new ButtonBuilder()
                .setCustomId("qbut_1")
                .setEmoji("⏮️")
                .setStyle("Secondary")
        
                const but2 = new ButtonBuilder()
                .setCustomId("qbut_2")
                .setEmoji(`${client.emoji.skip}`)
                .setStyle("Secondary")
        
                const but3 = new ButtonBuilder()
                .setCustomId("qbut_3")
                .setLabel(`${queuedList + 1}/${Page.length}`)
                .setStyle("Secondary")
                .setDisabled(true)
        
                const row = new ActionRowBuilder().addComponents([but1, but3, but2]);
        
                const msg = await interaction.editReply({ embeds: [embed], components: [row] })
        
                const collector = interaction.channel.createMessageComponentCollector({
                    filter: async (int) => {
                        if (int.user.id === interaction.user.id) { 
                            return true;
                        } else {
                            i.reply({
                                ephemeral: true,
                                content: `${client.emoji.wrong} | Only **${i.user.tag}** can use this button, if you want then you've to run the command again.`,
                            });
                            return false;
                        }
                    },
                    time: 60000 * 5,
                    idle: 40000,
                });

                collector.on("end", async () => {
                    msg.edit({ components: [] })
                })
  
                collector.on('collect', async (i) => {
                    if (!i.deferred) i.deferUpdate();

                    if (i.customId === 'qbut_1') {
                        queuedList = queuedList > 0 ? --queuedList : Page.length - 1;

                        if (queuedList === 0) {
                            const embed = new EmbedBuilder()
                            .setAuthor({ name: `${i.guild.name}'s Queue`, iconURL: i.guild.iconURL() })
                            .addFields(
                                { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                                { name:"Queued Tracks", value: `${Page[queuedList]} ` }
                            )
                            .setColor("Random")
                            .setFooter({ text: `Page:- ${queuedList + 1}/${Page.length}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                            msg.edit({ 
                                embeds: [embed],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                       but1,
                                       but3.setLabel(`${queuedList + 1}/${Page.length}`),
                                       but2
                                    ),
                                ], 
                            })
                        } else {
                            const embed2 = new EmbedBuilder()
                            .setAuthor({ name: `${i.guild.name}'s Queue`, iconURL: i.guild.iconURL() })
                            .addFields(
                                { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                                { name: "Queued Tracks", value: `${Page[queuedList]}` }
                            )
                            .setColor("Random")
                            .setFooter({ text: `Page:- ${queuedList + 1}/${Page.length}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
  
                            await msg.edit({
                                embeds: [embed2],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                      but1,
                                      but3.setLabel(`${queuedList + 1}/${Page.length}`),
                                      but2
                                    ),
                                ],
                            });
                        }
                    }

                    if (i.customId === 'qbut_2') {
                        queuedList = queuedList + 1 < Page.length ? ++queuedList : 0;

                        if (queuedList === 0) {
                            const embed = new EmbedBuilder()
                            .setAuthor({ name: `${i.guild.name}'s Queue`, iconURL: i.guild.iconURL() })
                            .addFields(
                                { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                                { name: "Queued Tracks", value: `${Page[queuedList]}` }
                            )
                            .setColor("Random")
                            .setFooter({ text: `Page:- ${queuedList + 1}/${Page.length}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            
                            msg.edit({ 
                                embeds: [embed],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        but1,
                                        but3.setLabel(`${queuedList + 1}/${Page.length}`),
                                        but2
                                    ),
                                ],  
                            })
                        } else {
                            const embed1 = new EmbedBuilder()
                            .setAuthor({ name: `${i.guild.name}'s Queue`, iconURL: i.guild.iconURL() })
                            .addFields(
                                { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                                { name: "Queued Tracks", value: `${Page[queuedList]}` }
                            )
                            .setColor("Random")
                            .setFooter({ text: `Page:- ${queuedList + 1}/${Page.length}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                  
                            await msg.edit({
                                embeds: [embed1],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        but1,
                                        but3.setLabel(`${queuedList + 1}/${Page.length}`),
                                        but2
                                    ),
                                ], 
                            });
                        }
                    }
                })
            } else {
                const embed3 = new EmbedBuilder()
                .setAuthor({ name: `${i.guild.name}'s Queue`, iconURL: i.guild.iconURL() })
                .addFields(
                    { name: "Now Playing", value: `[${Queue.currentTrack.title}](${Queue.currentTrack.url}) • \`[ ${convertTime(Queue.node.getTimestamp(true).current.value)} / ${Queue.currentTrack.duration} ]\`` },
                    { name: "Queued Tracks", value: `${Page[queuedList]}` }
                )
                .setColor("Random")
                .setFooter({ text: `Page:- ${queuedList + 1}/${Page.length}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        
                return interaction.editReply({ embeds: [embed3] });
            }
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Fetch The Queue Data, Anytime Now! Try Again Later.` });
        }
    }
}