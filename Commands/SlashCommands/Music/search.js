const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Searches for a song")
    .addStringOption(option =>
        option.setName('song')
        .setDescription('The song you want to search')
        .setRequired(true)
    ),
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
            const vc = interaction.member.voice.channel;
            Queue = await Player.nodes.create(interaction.guild, {
                leaveOnEnd: false,
                leaveOnStop: false,
                leaveOnEmpty: false,
                volume: 80,
                bufferingTimeout: 200,
                selfDeaf: true,
                metadata: {
                    guild: interaction.guild.id,
                    channel: interaction.channel.id
                }
            });

            if (!Queue.connection) Queue.connect(vc);
        }

        const searchQuery = interaction.options.getString("song");

        let searchResult;
        searchResult = await Player.search(`${searchQuery}`, {
            requestedBy: interaction.user
        });

        if (!searchResult || !searchResult.tracks.length) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | No Results Found!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] });
        }

        try {
            if (!searchResult || !searchResult.tracks.length) {
                const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | No Results Found!`)
                .setColor("Random")

                return interaction.editReply({ embeds: [embed] });
            }

            const searched = new EmbedBuilder()
            .setDescription("Select the track you want to add to the queue by the menu below.")
            .setColor("Random");

            const menu = new StringSelectMenuBuilder()
            .setCustomId('menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(`Click here to choose a track`)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel(`${searchResult.tracks[0].title}`)
                .setValue("search_one")
                .setDescription(`${searchResult.tracks[0].author} | ${searchResult.tracks[0].duration}`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`${searchResult.tracks[1].title}`)
                .setValue("search_two")
                .setDescription(`${searchResult.tracks[1].author} | ${searchResult.tracks[1].duration}`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`${searchResult.tracks[2].title}`)
                .setValue("search_three")
                .setDescription(`${searchResult.tracks[2].author} | ${searchResult.tracks[2].duration}`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`${searchResult.tracks[3].title}`)
                .setValue("search_four")
                .setDescription(`${searchResult.tracks[3].author} | ${searchResult.tracks[3].duration}`),
                new StringSelectMenuOptionBuilder()
                .setLabel(`${searchResult.tracks[4].title}`)
                .setValue("search_five")
                .setDescription(`${searchResult.tracks[4].author} | ${searchResult.tracks[4].duration}`),
            );

            const menu2 = new StringSelectMenuBuilder()
            .setCustomId('menu2')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(`The Action To Choose The Track Is Disabled!`)
            .setDisabled(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel(`The Action To Choose The Track Is Disabled!`)
                .setValue("Interaction disabled")
                .setDescription(`The Action To Choose The Track Is Disabled!`)
            );

            const row = new ActionRowBuilder()
            .addComponents(menu);

            const row2 = new ActionRowBuilder()
            .addComponents(menu2);

            const msg = await interaction.editReply({embeds: [searched], components: [row] });

            const search = new EmbedBuilder()
            .setColor("Random");

            const collector = msg.createMessageComponentCollector({
                filter: (interaction) => {
                    if (interaction.user.id === interaction.user.id) {
                        return true;
                    } else {
                        interaction.reply({ ephemeral: true, content: `${client.emoji.wrong} | You are not connected to <#${Queue.channel.id}> to use this buttons.` });
                        return false;
                    };
                },
                max: 1,
                time : 60000,
                idle: 60000
            });

            collector.on("end", async () => {
                if (msg) return msg.edit({ components: [row2] })
            });

            collector.on("collect", async (interaction) => {
                if (!interaction.deferred) interaction.deferUpdate().catch(() => {});

                const optionselected = interaction.values[0];

                if (optionselected === "search_one") {
                    const track = searchResult.tracks[0];
                    Queue.addTrack(track);
                    if (!Queue.node.isPlaying()) Queue.node.play();

                    if(msg) return msg.edit({embeds: [search.setDescription(`${client.emoji.tick} | Queued [${track.title}](${track.url})`)]})
                } else if (optionselected === "search_two") {
                    const track = searchResult.tracks[1];
                    Queue.addTrack(track);
                    if (!Queue.node.isPlaying()) Queue.node.play();

                    if (msg) return msg.edit({embeds: [search.setDescription(`${client.emoji.tick} | Queued [${track.title}](${track.url})`)]})
                } else if (optionselected === "search_three") {
                    const track = searchResult.tracks[2];
                    Queue.addTrack(track);

                    if (!Queue.node.isPlaying()) Queue.node.play();
                } else if (optionselected === "search_four") {
                    const track = searchResult.tracks[3];
                    Queue.addTrack(track);
                    if (!Queue.node.isPlaying()) Queue.node.play();

                    if (msg) return msg.edit({embeds: [search.setDescription(`${client.emoji.tick} | Queued [${track.title}](${track.url})`)]})
                } else if (optionselected === "search_five") {
                    const track = searchResult.tracks[4];
                    Queue.addTrack(track);
                    if (!Queue.node.isPlaying()) Queue.node.play();

                    if (msg) return msg.edit({embeds: [search.setDescription(`${client.emoji.tick} | Queued [${track.title}](${track.url})`)]})
                }
            });
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Search The Music And Play In The Voice Channel, Anytime Now! Try Again Later.` });
        }
    }
};