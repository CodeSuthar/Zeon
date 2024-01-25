const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
        .setName("filters")
        .setDescription("Set EqualizerBand"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();
        let Queue = await useQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | You Need To Be Connected To A Voice Channel To Use This Command!`)
                .setColor("Random");

            return interaction.editReply({ embeds: [embed] });
        }

        if (Queue && Queue.channel.id !== interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | I'm Connected To <#${Queue.channel.id}> Voice Channel, You Need To Be In The Same Channel As Me To Control Me!`)
                .setColor("Random");

            return interaction.editReply({ embeds: [embed] });
        }

        if (!Queue) {
            const emb = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | There Is No Player To Set Filter In This Server!`)
                .setColor("Random");

            return interaction.editReply({ embeds: [emb] });
        }

        const butclear = new ButtonBuilder()
            .setCustomId("clear")
            .setLabel("Clear Filters")
            .setStyle(ButtonStyle.Danger);

        const selectmenu = new StringSelectMenuBuilder()
            .setCustomId("filter")
            .setPlaceholder("Select a filter - List 1")
            .addOptions([
                {
                    label: "8D",
                    value: "8D",
                    emoji: "🎧",
                    description: "Simulate 8D audio effect (surround)"
                },
                {
                    label: "Bass Boost",
                    value: "bassboost",
                    emoji: "🔉",
                    description: "Boost the bass frequencies in the audio"
                },
                {
                    label: "Bass Boost High",
                    value: "bassboost_high",
                    emoji: "🔊",
                    description: "Boost the high bass frequencies in the audio"
                },
                {
                    label: "Bass Boost Low",
                    value: "bassboost_low",
                    emoji: "🔉",
                    description: "Boost the low bass frequencies in the audio"
                },
                {
                    label: "Chorus",
                    value: "chorus",
                    emoji: "🎶",
                    description: "Add a chorus effect to the audio"
                },
                {
                    label: "Chorus 2D",
                    value: "chorus2d",
                    emoji: "🎵",
                    description: "Add a 2D chorus effect to the audio"
                },
                {
                    label: "Chorus 3D",
                    value: "chorus3d",
                    emoji: "🎶",
                    description: "Add a 3D chorus effect to the audio"
                },
                {
                    label: "Compressor",
                    value: "compressor",
                    emoji: "🗜️",
                    description: "Apply audio compression to even out the levels"
                },
                {
                    label: "Dim",
                    value: "dim",
                    emoji: "🌘",
                    description: "Apply a dimming effect to the audio"
                },
                {
                    label: "Ear-Rape",
                    value: "earrape",
                    emoji: "🏑",
                    description: "Apply an extreme, loud audio effect"
                },
                {
                    label: "Expander",
                    value: "expander",
                    emoji: "🔊",
                    description: "Expand the dynamic range of the audio"
                },
                {
                    label: "Fade In",
                    value: "fadein",
                    emoji: "📈",
                    description: "Apply a fade-in effect to the audio"
                },
                {
                    label: "Flanger",
                    value: "flanger",
                    emoji: "🎚️",
                    description: "Add a flanger effect to the audio"
                },
                {
                    label: "Gate",
                    value: "gate",
                    emoji: "🚪",
                    description: "Apply a gating effect to the audio"
                },
                {
                    label: "Haas",
                    value: "haas",
                    emoji: "🎶",
                    description: "Create a Haas effect in the audio"
                },
                {
                    label: "Karaoke",
                    value: "karaoke",
                    emoji: "🎤",
                    description: "Apply a karaoke effect to the audio"
                },
                {
                    label: "Lo-Fi",
                    value: "lofi",
                    emoji: "📻",
                    description: "Add a lo-fi effect to the audio"
                },
                {
                    label: "MCompand",
                    value: "mcompand",
                    emoji: "📈",
                    description: "Apply a multi-band compander to the audio"
                },
                {
                    label: "Mono",
                    value: "mono",
                    emoji: "1️⃣",
                    description: "Convert the audio to mono"
                },
                {
                    label: "MSTLR",
                    value: "mstlr",
                    emoji: "🎚️",
                    description: "Apply a mid-side to left-right conversion"
                },
                {
                    label: "MSTRR",
                    value: "mstrr",
                    emoji: "🎚️",
                    description: "Apply a mid-side to right-left conversion"
                },
                {
                    label: "Nightcore",
                    value: "nightcore",
                    emoji: "🌃",
                    description: "Apply a nightcore effect to the audio"
                },
                {
                    label: "Normalizer",
                    value: "normalizer",
                    emoji: "🟢",
                    description: "Normalize the audio levels"
                },
                {
                    label: "Normalizer 2",
                    value: "normalizer2",
                    emoji: "🟢",
                    description: "Apply a second level of normalization to the audio"
                },
                {
                    label: "Phaser",
                    value: "phaser",
                    emoji: "🌊",
                    description: "Add a phaser effect to the audio"
                }
            ])
            .setMaxValues(25)
            .setMinValues(1)

        const selectmenu2 = new StringSelectMenuBuilder()
            .setCustomId("filter2")
            .setPlaceholder("Select a filter - List 2")
            .addOptions(
                [
                    {
                        label: "Pulsator",
                        value: "pulsator",
                        emoji: "🫀",
                        description: "Apply a pulsating effect to the audio"
                    },
                    {
                        label: "Reverse",
                        value: "reverse",
                        emoji: "🔄",
                        description: "Reverse the audio playback"
                    },
                    {
                        label: "Silence Remove",
                        value: "silenceremove",
                        emoji: "🔇",
                        description: "Remove silent portions from the audio"
                    },
                    {
                        label: "Soft Limiter",
                        value: "softlimiter",
                        emoji: "🥎",
                        description: "Apply a soft limiting effect to prevent clipping"
                    },
                    {
                        label: "Sub Boost",
                        value: "subboost",
                        emoji: "🚡",
                        description: "Boost the sub-bass frequencies in the audio"
                    },
                    {
                        label: "Surrounding",
                        value: "surrounding",
                        emoji: "🔛",
                        description: "Create a surrounding effect in the audio"
                    },
                    {
                        label: "Trebble",
                        value: "treble",
                        emoji: "🤝",
                        description: "Boost the treble frequencies in the audio"
                    },
                    {
                        label: "Tremolo",
                        value: "tremolo",
                        emoji: "🎶",
                        description: "Apply a tremolo effect to the audio"
                    },
                    {
                        label: "Vaporwave",
                        value: "vaporwave",
                        emoji: "👋",
                        description: "Apply a vaporwave effect to the audio"
                    },
                    {
                        label: "Vibrato",
                        value: "vibrato",
                        emoji: "🎶",
                        description: "Add a vibrato effect to the audio"
                    }
                ]
            )
            .setMaxValues(10)
            .setMinValues(1)

        const actrow = new ActionRowBuilder()
            .addComponents(
                butclear
            );

        const actrow1 = new ActionRowBuilder()
            .addComponents(
                selectmenu
            );

        const actrow2 = new ActionRowBuilder()
            .addComponents(
                selectmenu2
            );

        const emb = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`Choose what filter you want from the selectmenu below`);

        const m = await interaction.editReply({ embeds: [emb], components: [actrow, actrow1, actrow2] });

        const collector = m.createMessageComponentCollector({
            filter: (f) => f.user.id === interaction.user.id ? true : false && f.deferUpdate().catch(() => { }),
            time: 60000,
            idle: 60000 / 2
        });

        collector.on("end", async () => {
            if (!m) return;

            const butclear = new ButtonBuilder()
                .setCustomId("clear")
                .setLabel("Clear Filters")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true);

            const selectmenu = new StringSelectMenuBuilder()
            .setCustomId("filter")
            .setPlaceholder("Select a filter - List 1")
            .addOptions([
                {
                    label: "Vibrato",
                    value: "vibrato",
                    emoji: "🎶",
                    description: "Add a vibrato effect to the audio"
                }
            ])
            .setMinValues(1)
            .setMaxValues(1)
            .setDisabled(true)

            const selectmenu2 = new StringSelectMenuBuilder()
            .setCustomId("filter2")
            .setPlaceholder("Select a filter - List 2")
            .addOptions([
                {
                    label: "Vibrato",
                    value: "vibrato",
                    emoji: "🎶",
                    description: "Add a vibrato effect to the audio"
                }
            ])
            .setMinValues(1)
            .setMaxValues(1)
            .setDisabled(true)

            const actrow = new ActionRowBuilder()
            .addComponents(
                butclear
            );

            const actrow1 = new ActionRowBuilder()
            .addComponents(
                selectmenu
            );

            const actrow2 = new ActionRowBuilder()
            .addComponents(
                selectmenu2
            );

            await m.edit({ components: [actrow, actrow1, actrow2] });
        });

        collector.on("collect", async (int) => {
            if (!int.replied || !int.deferred) await int.deferUpdate({ ephemeral: true });

            if (int.customId === "clear") {
                if (Queue.filters.ffmpeg.filters.length > 0) {
                    const EnabledFilters = Queue.filters.ffmpeg.getFiltersEnabled();

                    await Queue.filters.ffmpeg.setFilters(false);

                    const embed = new EmbedBuilder()
                        .setColor("Random")
                        .setTitle("🔍 Filters Status")
                        .setDescription(`${client.emoji.tick} | Good news! The filters are cleared in the player!`)
                        .addFields(
                            { name: "🟢 Enabled Filters", value: `\`[ None ]\` ]`, inline: true },
                            { name: "🔴 Disabled Filters", value: EnabledFilters.length > 0 ? `\`[ ${EnabledFilters.join(`, `)} ]\`` : `\`[ None ]\``, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        });

                    if (m) await m.edit({ embeds: [embed] });
                }
            } else if (int.customId === "filter" || int.customId === "filter2") {
                const filters = int.values;
                const enabled = [];
                const disabled = [];

                for (const filter of filters) {
                    if (Queue.filters.ffmpeg.getFiltersEnabled().includes(filter)) {
                        disabled.push(filter);
                    } else {
                        enabled.push(filter);
                    }
                }

                await Queue.filters.ffmpeg.toggle();

                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("🔍 Filters Status")
                    .setDescription(`${client.emoji.tick} | Good news! The filters are updated in the player!`)
                    .addFields(
                        { name: "🟢 Enabled Filters", value: enabled.length > 0 ? `\`[ ${enabled.join(`, `)} ]\`` : `\`[ None ]\``, inline: true },
                        { name: "🔴 Disabled Filters", value: disabled.length > 0 ? `\`[ ${disabled.join(`, `)} ]\`` : `\`[ None ]\``, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    });

                if (m) await m.edit({ embeds: [embed] });
            }
        });
    }
};