const { EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const db = require("../../Database/MusicSetup.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) return;
        if (interaction.isStringSelectMenu()) return;
        if (interaction.isModalSubmit()) return;
        if (!["SETUP_VOL_DOWN_BUTTON", "SETUP_STOP_BUTTON", "SETUP_PLAY_PAUSE_BUTTON", "SETUP_SKIP_BUTTON", "SETUP_VOL_UP_BUTTON"].includes(interaction.customId)) return;

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guild.id);

        const emb = new EmbedBuilder().setColor("Random");

        if (interaction.isButton()) {
            const but = interaction.customId;
            switch (but) {
                case "SETUP_VOL_DOWN_BUTTON":
                    let amount = Number(Queue.node.volume) - 10;

                    if (amount === -10 || amount < 0) {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | Player Volume Limit Is Between 0 And 150!`)
                        .setColor("Random")
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                    } else {
                        let embed;

                        if (amount === 0) {
                            embed = new EmbedBuilder()
                            .setDescription(`${client.emoji.tick} | Player Have Been Muted Sucessfully`)
                            .setColor("Random")
                        } else {
                            embed = new EmbedBuilder()
                            .setDescription(`${client.emoji.volumedown} | Player Volume Has Been Set To ${amount}`)
                            .setColor("Random")
                        }

                        await Queue.node.setVolume(amount);
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                break;

                case "SETUP_STOP_BUTTON":
                    if (!Queue || Queue && !Queue.currentTrack) {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | There's No Player Playing In The Guild`)
                        .setColor("Random")
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                    } else {
                        if (Queue.tracks.length) Queue.clear(); //there is a bug if we stop the queue it will delete the queue and we can't use leave cmd after that because the queue has been destroyed

                        if (Queue.node.isPlaying()) Queue.node.skip(); //so clearing the queue than skipping it will work like stop 
                        return await interaction.reply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.tick} | The Player Has Been Stopped`)], ephemeral: true });
                    }
                break;

                case "SETUP_PLAY_PAUSE_BUTTON":
                    let Action;
                    let DecisionEmbed;

                    let data = await db.findOne({ _id: interaction.guild.id });

                    if (!Queue.node.isPaused()) {
                        Queue.node.pause();
                        Action = `**Paused**`

                        DecisionEmbed = new EmbedBuilder()
                        .setAuthor({ name: "|  Paused", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`[${Queue.currentTrack.title}](${Queue.currentTrack.url})`)
                        .addFields(
                            {
                                name: "Duration",
                                value: `\`[ ${Queue.currentTrack.duration} ]\``,
                                inline: true
                            },
                            {
                                name: "Requester",
                                value: `\`[ ${Queue.currentTrack.requestedBy.username} | ${Queue.currentTrack.requestedBy.id} ]\``,
                                inline: true
                            }
                        )
                        .setThumbnail(Queue.currentTrack.thumbnail)
                        .setTimestamp()
                        .setColor("Random")
                    } else {
                        Queue.node.resume();
                        Action = `**Resumed**`

                        DecisionEmbed = new EmbedBuilder()
                        .setAuthor({ name: "|  Playing", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`[${Queue.currentTrack.title}](${Queue.currentTrack.url})`)
                        .addFields(
                            {
                                name: "Duration",
                                value: `\`[ ${Queue.currentTrack.duration} ]\``,
                                inline: true
                            },
                            {
                                name: "Requester",
                                value: `\`[ ${Queue.currentTrack.requestedBy.username} | ${Queue.currentTrack.requestedBy.id} ]\``,
                                inline: true
                            }
                        )
                        .setThumbnail(Queue.currentTrack.thumbnail)
                        .setTimestamp()
                        .setColor("Random")
                    }

                    let QueueData = Queue.metadata;
                    const Guild = await client.guilds.cache.get(QueueData.guild) || await client.guilds.fetch(QueueData.guild);
                    const Channel = await Guild.channels.cache.get(QueueData.channel) || await Guild.channels.fetch(QueueData.channel);
                    const Information = await Player.getNowPlayingMessage(Guild.id);

                    if (Channel) {
                        await Channel.messages.edit(Information, {
                            embeds: [DecisionEmbed]
                        });
                    }

                    await interaction.reply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.tick} | The Player Has Been ${Action}`)], ephemeral: true });
                break;

                case "SETUP_SKIP_BUTTON":
                    const embed = new EmbedBuilder()
                    .setAuthor({ name: "Skipped The Track" })
                    .setDescription(`${client.emoji.tick} | Skipped The Current Track`)
                    .setColor("Random")
                    await interaction.reply({ embeds: [embed], ephemeral: true })
                    Queue.node.skip();
                break;

                case "SETUP_VOL_UP_BUTTON":
                    let amount1 = Number(Queue.node.volume) + 10;

                    if (amount1 === 160 || amount1 > 150) {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | Player Volume Limit Is Between 0 And 150!`)
                        .setColor("Random")
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                    } else {
                        await Queue.node.setVolume(amount1);
                        await interaction.reply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.volumeup} | Player Volume Has Been Set To **${amount1}**`)], ephemeral: true });
                    }
                break;
            }
        }
    }
};

/* const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const db = require("../../Database/MusicSetup.js");


module.exports = {
    name: "playerStart",
    run: async (client, queue, track) => {
        let Player = await useMainPlayer();
        let data = await db.findOne({ _id: queue.guild.id });

        const queuedata = queue.metadata;
        const Guild = await client.guilds.cache.get(queuedata.guild) || await client.guilds.fetch(queuedata.guild);
        if (!Guild) return;
        const Channel = await Guild.channels.cache.get(queuedata.channel) || await Guild.channels.fetch(queuedata.channel);
        if (!Channel) return;
        if (data && data.channel && data.channel === Channel.id) return;

        const MusicPlaying = new EmbedBuilder()
        .setAuthor({ name: "|  Playing", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
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

        const But1 = new ButtonBuilder().setCustomId("volumedown").setEmoji(`${client.emoji.volumedown}`).setStyle("Secondary");

        const But2 = new ButtonBuilder().setCustomId("stop").setEmoji(`${client.emoji.stop}`).setStyle("Secondary");

        const But3 = new ButtonBuilder().setCustomId("pause").setEmoji(`${client.emoji.pause}`).setStyle("Secondary");

        const But4 = new ButtonBuilder().setCustomId("skip").setEmoji(`${client.emoji.skip}`).setStyle("Secondary");

        const But5 = new ButtonBuilder().setCustomId("volumeup").setEmoji(`${client.emoji.volumeup}`).setStyle("Secondary");

        const row = new ActionRowBuilder().addComponents(But1, But2, But3, But4, But5)

        let id;

        const msg = Channel.send({ embeds: [MusicPlaying], components: [row] }).then(async (msg) => {
            id = msg.id
            await Player.setNowPlayingMessage(Guild.id, id);
        })
      
        const collector = Channel.createMessageComponentCollector({
            filter: async (interaction) => {
                if (queue && queue.channel.id === interaction.member.voice.channelId) {
                    return true;
                } else {
                    await interaction.reply({ content: `${client.emoji.wrong} | You are not connected to <#${queue.channel.id}> to use this buttons.`, ephemeral: true });
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
                    .setDescription(`${client.emoji.wrong} | Player Volume Limit Is Between 0 And 150!`)
                    .setColor("Random")
                    await interaction.editReply({ embeds: [embed], ephemeral: true }) 
                } else {     
                    let embed;
                              
                    if (amount === 0) {
                        embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.tick} | Player Have Been Muted Sucessfully`)
                        .setColor("Random")
                    } else {
                        embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.volumedown} | Player Volume Has Been Set To ${amount}`)
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
                        .setDescription(`${client.emoji.wrong} | Player Volume Limit Is Between 0 And 150!`)
                        .setColor("Random")
                        await interaction.editReply({ embeds: [embed], ephemeral: true }) 
                    } else {
                        await queue.node.setVolume(amount);
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.volumeup} | Player Volume Has Been Set To **${amount}**`)], ephemeral: true });
                    }
                } else {
                    if (interaction.customId === "stop") {
                        if (!queue || queue && !queue.currentTrack) {
                            const embed = new EmbedBuilder()
                            .setDescription(`${client.emoji.wrong} | There's No Player Playing In The Guild`)
                            .setColor("Random")
                            await interaction.editReply({ embeds: [embed], ephemeral: true })  
                        } else {
                            if (queue.tracks.length) queue.clear(); //there is a bug if we stop the queue it will delete the queue and we can't use leave cmd after that because the queue has been destroyed

                            if (queue.node.isPlaying()) queue.node.skip(); //so clearing the queue than skipping it will work like stop 
                            await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.tick} | The Player Has Been Stopped`)], ephemeral: true });
                          
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
                            } else {
                                queue.node.resume();
                                Action = `**Resumed**`

                                DecisionEmbed = new EmbedBuilder()
                                .setAuthor({ name: "|  Playing", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
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
                            }

                            await Channel.messages.edit(id, {
                                embeds: [DecisionEmbed],
                                components: [row]
                            })
        
                            await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.tick} | The Player Has Been ${Action}`)], ephemeral: true });
                        } else {
                            if (interaction.customId === "skip") {
                                const embed = new EmbedBuilder()
                                .setAuthor({ name: "Skipped The Track" })
                                .setDescription(`${client.emoji.tick} | Skipped The Current Track`)
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
} */