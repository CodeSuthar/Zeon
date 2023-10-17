const { EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) return;
        if (interaction.isStringSelectMenu()) return;
        if (interaction.isModalSubmit()) return;
        if (!["SETUP_VOL_DOWN_BUTTON", "SETUP_STOP_BUTTON", "SETUP_PLAY_PAUSE_BUTTON", "SETUP_SKIP_BUTTON", "SETUP_VOL_UP_BUTTON"].includes(interaction.customId)) return;

        let color = "#050f39";
        let failemoji = client.emoji.wrong;

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guild.id);

        const emb = new EmbedBuilder().setColor("Random");

        if (interaction.isButton()) {
            if (!interaction.replied) await interaction.deferReply({ ephemeral: true });
            const but = interaction.customId;

            if (!interaction.member.voice.channelId) {
                return await oops(interaction.channel, `You Need To Be Connected To A Voice Channel To Use This Buttons!`, color, failemoji, interaction);
            }

            if (Queue && Queue.channel.id !== interaction.member.voice.channelId) {
                return await oops(interaction.channel, `You Are Not Connected To <#${Queue.channel.id}> To Use This Buttons.`, color, failemoji, interaction);
            };

            if (!Queue) {
                return await oops(interaction.channel, `There's No Player In The Guild`, color, failemoji);
            };

            if (Queue && !Queue.currentTrack) {
                return await oops(interaction.channel, `There's No Player Playing In The Guild`, color, failemoji, interaction);
            };

            switch (but) {
                case "SETUP_VOL_DOWN_BUTTON":
                    let amount = Number(Queue.node.volume) - 10;

                    if (amount === -10 || amount < 0) {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | Player Volume Limit Is Between 0 And 150!`)
                        .setColor("Random")
                        return await interaction.editReply({ embeds: [embed], ephemeral: true })
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
                        return await interaction.editReply({ embeds: [embed], ephemeral: true });
                    }
                break;

                case "SETUP_STOP_BUTTON":
                    if (!Queue || Queue && !Queue.currentTrack) {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | There's No Player Playing In The Guild`)
                        .setColor("Random")
                        return await interaction.editReply({ embeds: [embed], ephemeral: true })
                    } else {
                        if (Queue.tracks.size) Queue.clear(); //there is a bug if we stop the queue it will delete the queue and we can't use leave cmd after that because the queue has been destroyed

                        if (Queue.currentTrack) Queue.node.skip(); //so clearing the queue than skipping it will work like stop 

                        if (Queue.node.isPaused()) Queue.node.resume(); //if the player is paused and we stop it, so setup system loads perfectly
                        
                        return await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.tick} | The Player Has Been Stopped`)], ephemeral: true });
                    }
                break;

                case "SETUP_PLAY_PAUSE_BUTTON":
                    let Action;
                    let DecisionEmbed;

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

                    if (Information) {
                        await Channel.messages.edit(Information, {
                            embeds: [DecisionEmbed]
                        });
                    }

                    return await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.tick} | The Player Has Been ${Action}`)], ephemeral: true });
                break;

                case "SETUP_SKIP_BUTTON":
                    const embed = new EmbedBuilder()
                    .setAuthor({ name: "Skipped The Track" })
                    .setDescription(`${client.emoji.tick} | Skipped The Current Track`)
                    .setColor("Random")
                    await interaction.editReply({ embeds: [embed], ephemeral: true })
                    return Queue.node.skip();
                break;

                case "SETUP_VOL_UP_BUTTON":
                    let amount1 = Number(Queue.node.volume) + 10;

                    if (amount1 === 160 || amount1 > 150) {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.emoji.wrong} | Player Volume Limit Is Between 0 And 150!`)
                        .setColor("Random")
                        return await interaction.editReply({ embeds: [embed], ephemeral: true })
                    } else {
                        await Queue.node.setVolume(amount1);
                        return await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setTimestamp().setDescription(`${client.emoji.volumeup} | Player Volume Has Been Set To **${amount1}**`)], ephemeral: true });
                    }
                break;
            }
        }
    }
};

async function oops(channel, args, color, emoji, interaction) {
    try {
        let embed1 = new EmbedBuilder().setColor(color).setDescription(`${emoji} | ${args}`);
  
        return interaction.editReply({
            embeds: [embed1]
        });
    } catch (e) {
        return console.error(e)
    }
};