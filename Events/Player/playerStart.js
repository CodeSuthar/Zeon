const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");


module.exports = {
    name: "playerStart",
    run: async (client, queue, track) => {
        let Player = await useMainPlayer();
        const queuedata = queue.metadata;
        const Guild = client.guilds.cache.get(queuedata.guild)
        if (!Guild) return;
        const Channel = Guild.channels.cache.get(queuedata.channel)
        if (!Channel) return;

        const MusicPlaying = new EmbedBuilder()
        .setAuthor({ name: "Now Playing", iconURL: "https://c.tenor.com/B-pEg3SWo7kAAAAi/disk.gif" })
        .setDescription(`**Now Playing** - *[${track.title}](${track.url})* - \`${track.duration}\``)
        .setFooter({ text: `Requested By ${track.requestedBy.tag}`, iconURL: track.requestedBy.displayAvatarURL() })
        .setColor("Random")

        const But1 = new ButtonBuilder().setCustomId("volumedown").setEmoji("🔉").setStyle("Primary");

        const But2 = new ButtonBuilder().setCustomId("stop").setEmoji("⏹️").setStyle("Secondary");

        const But3 = new ButtonBuilder().setCustomId("pause").setEmoji("⏸️").setStyle("Primary");

        const But4 = new ButtonBuilder().setCustomId("skip").setEmoji("⏭️").setStyle("Secondary");

        const But5 = new ButtonBuilder().setCustomId("volumeup").setEmoji("🔊").setStyle("Primary");

        const row = new ActionRowBuilder().addComponents(But1, But2, But3, But4, But5)

        let id;

        const msg = Channel.send({ embeds: [MusicPlaying], components: [row] }).then(async (msg) => {
            id = msg.id
            await Player.setNowPlayingMessage(Guild.id, msg);
        })
      
        const collector = Channel.createMessageComponentCollector({
            filter: async (interaction) => {
                if (queue && queue.channel.id === interaction.member.voice.channelId) {
                    return true;
                } else {
                    if (!interaction.replied)
                    
                    await interaction.editReply({ content: `You are not connected to <#${queue.channel.id}> to use this buttons.`, ephemeral: true });
                    return false;
                };
            },
            time: track.durationMS,
        });

        collector.on("collect", async (interaction) => {
            if (!interaction.replied) await interaction.deferReply({ ephemeral: true });
          
            if (interaction.customId === "volumedown") {
                let amount = Number(queue.node.volume) - 10;

                if (amount === -10 || amount < 0) {
                    const embed = new EmbedBuilder()
                    .setDescription(`Player Volume Limit Is Between 0 And 150!`)
                    .setColor("Random")
                    await interaction.editReply({ embeds: [embed], ephemeral: true }) 
                } else {     
                    let embed;
                              
                    if (amount === 0) {
                        embed = new EmbedBuilder()
                        .setDescription("Player Have Been Muted Sucessfully")
                        .setColor("Random")
                    } else {
                        embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.volumedown} Player Volme Has Been Set To ${amount}`)
                        .setColor("Random")
                    }
          
                    await queue.node.setVolume(amount);
                    await interaction.editReply({ embeds: [embed], ephemeral: true });
                }
            } else {
                if (interaction.customId === "volumeup") {
                    let amount = Number(queue.node.volume) + 10;

                    if (amount === 160 || amount > 150) {
                        const embed = new EmbedBuilder()
                        .setDescription(`Player Volume Limit Is Between 0 And 150!`)
                        .setColor("Random")
                        await interaction.editReply({ embeds: [embed], ephemeral: true }) 
                    } else {
                        await queue.node.setVolume(amount);
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.volumeup} Set the volume to: **${amount}**`)], ephemeral: true });
                    }
                } else {
                    if (interaction.customId === "stop") {
                        if (!queue || queue && !queue.node.isPlaying()) {
                            const embed = new EmbedBuilder()
                            .setDescription(`There's No Player Playing In The Guild`)
                            .setColor("Random")
                            await interaction.editReply({ embeds: [embed], ephemeral: true })  
                        } else {
                            const embedend = new EmbedBuilder()
                            .setTitle("Seems... Like Track Has Been Ended")
                            .setDescription(`*[${track.title}](${track.url})* - Track Has Been **Ended**`)
                            .setFooter({ text: `Track Was Requested By ${track.requestedBy.tag}`, iconURL: track.requestedBy.displayAvatarURL() })
                            .setColor("Random")

                            const But1 = new ButtonBuilder()
                            .setCustomId("volumedown")
                            .setEmoji("🔉")
                            .setStyle("Primary")
                            .setDisabled(true)
            
                            const But2 = new ButtonBuilder()
                            .setCustomId("stop")
                            .setEmoji("⏹️")
                            .setStyle("Secondary")
                            .setDisabled(true)
            
                            const But3 = new ButtonBuilder()
                            .setCustomId("pause")
                            .setEmoji("⏸️")
                            .setStyle("Primary")
                            .setDisabled(true)
            
                            const But4 = new ButtonBuilder()
                            .setCustomId("skip")
                            .setEmoji("⏭️")
                            .setStyle("Secondary")
                            .setDisabled(true)
                
                            const But5 = new ButtonBuilder()
                            .setCustomId("volumeup")
                            .setEmoji("🔊")
                            .setStyle("Primary")
                            .setDisabled(true)
                
                            const row = new ActionRowBuilder().addComponents(But1, But2, But3, But4, But5);
      
                            await Channel.messages.edit(id, {
                                embeds: [embedend],
                                components: [row]
                            })
                
                            if (queue.tracks.length) queue.clear(); //there is a bug if we stop the queue it will delete the queue and we can't use leave cmd after that because the queue has been destroyed

                            if (queue.node.isPlaying()) queue.node.skip(); //so clearing the queue than skipping it will work like stop 
                            await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`The Player Has Been Stopped`)], ephemeral: true });
                          
                            return await collector.stop()
                        }    
                    } else {
                        if (interaction.customId === "pause") {
                            let Action;
                            let DecisionEmbed;
                            if (!queue.node.isPaused()) {
                                queue.node.pause();
                                Action = `**Paused**`

                                DecisionEmbed = new EmbedBuilder()
                                .setAuthor({ name: "Paused", iconURL: "https://c.tenor.com/B-pEg3SWo7kAAAAi/disk.gif" })
                                .setDescription(`**Paused** - *[${track.title}](${track.url})* - \`${track.duration}\``)
                                .setFooter({ text: `Requested By ${track.requestedBy.tag}`, iconURL: track.requestedBy.displayAvatarURL() })
                                .setColor("Random")
                            } else {
                                queue.node.resume();
                                Action = `**Resumed**`

                                DecisionEmbed = new EmbedBuilder()
                                .setAuthor({ name: "Now Playing", iconURL: "https://c.tenor.com/B-pEg3SWo7kAAAAi/disk.gif" })
                                .setDescription(`**Now Playing** - *[${track.title}](${track.url})* - \`${track.duration}\``)
                                .setFooter({ text: `Requested By ${track.requestedBy.tag}`, iconURL: track.requestedBy.displayAvatarURL() })
                                .setColor("Random")
                            }

                            await Channel.messages.edit(id, {
                                embeds: [DecisionEmbed],
                                components: [row]
                            })
        
                            await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`The Player Has Been ${Action}`)], ephemeral: true });
                        } else {
                            if (interaction.customId === "skip") {
                                const embed = new EmbedBuilder()
                                .setAuthor({ name: "Skipped The Track" })
                                .setDescription(`Skipped - [${track.title}](${track.url})`)
                                .setColor("Random")
                                await interaction.editReply({ embeds: [embed], ephemeral: true })
                                queue.node.skip();
                            }
                        }
                    }
                }
            }
        })
    }
}