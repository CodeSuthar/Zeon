const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const db = require("../../../Database/MusicSetup.js");
const { readdirSync } = require('fs');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup The Music Player In Your Server!")
    .addSubcommand(subcommand => subcommand
        .setName("create")
        .setDescription("Create The Music Player In Your Server!")
    )
    .addSubcommand(subcommand => subcommand
        .setName("delete")
        .setDescription("Delete The Music Player In Your Server!")
    )
    .addSubcommand(subcommand => subcommand
        .setName("info")
        .setDescription("Get The Music Player Information In Your Server!")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guildId);

        let data = await db.findOne({ _id: interaction.guildId });

        let imgs = readdirSync("./Assets/img/").filter(c => c.split('.').pop() === 'png');

        let img = imgs[Math.floor(Math.random() * imgs.length)];

        let file = new AttachmentBuilder(`./Assets/img/${img}`, `${img}`).setName(`Zeon-Music-Banner.png`);

        const title = Queue && Queue.currentTrack ? `Now Playing` : "**Join a voice channel and queue songs by name/url.**";
        const desc = Queue && Queue.currentTrack ? `[**__${Queue.currentTrack.title}__**](${Queue.currentTrack.url})` : null;
        const footer = {
            name: Queue && Queue.currentTrack ? `Requested by ${Queue.currentTrack.requestedBy.username}` : "Thank you for using " + client.user.username,
            url: Queue && Queue.currentTrack ? `${Queue.currentTrack.requestedBy.displayAvatarURL({})}` : `${client.user.displayAvatarURL({})}`
        };
        const image = Queue && Queue.currentTrack ? Queue.currentTrack.thumbnail : "https://i.ibb.co/D9SRhHP/Music.png";

        let embed1 = new EmbedBuilder()
        .setColor("#050f39")
        .setTitle(title)
        .setFooter({ text: footer.name, iconURL: footer.url })
        .setImage(image);

        if (Queue && Queue.currentTrack) embed1.setDescription(desc);

        let disabled = true;
        if (Queue && Queue.currentTrack) disabled = false;

        let lowvolumebut = new ButtonBuilder()
        .setCustomId(`SETUP_VOL_DOWN_BUTTON`)
        .setEmoji(`${client.emoji.volumedown}`)
        .setStyle(2)

        let stopbut = new ButtonBuilder()
        .setCustomId(`SETUP_STOP_BUTTON`)
        .setEmoji(`${client.emoji.stop}`)
        .setStyle(2)

        let pausebut = new ButtonBuilder()
        .setCustomId(`SETUP_PLAY_PAUSE_BUTTON`)
        .setEmoji(`${client.emoji.pause}`)
        .setStyle(2)

        let skipbut = new ButtonBuilder()
        .setCustomId(`SETUP_SKIP_BUTTON`)
        .setEmoji(`${client.emoji.skip}`)
        .setStyle(2)

        let highvolumebut = new ButtonBuilder()
        .setCustomId(`SETUP_VOL_UP_BUTTON`)
        .setEmoji(`${client.emoji.volumeup}`)
        .setStyle(2)
        
        const row1 = new ActionRowBuilder()
        .addComponents(lowvolumebut, stopbut, pausebut, skipbut, highvolumebut);

        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "create":
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Channels Or Administrator permission to use this command!` });

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Channels Or Administrator permission to use this command!` });

                if (data) {
                    const embed10 = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.wrong} | The song request channel is already set to <#${data.TextChannel}>`)
                    return await interaction.editReply({ embeds: [embed10] });
                }

                const parent = await interaction.guild.channels.create({
                    name: `${client.user.username}'s Music Zone`,
                    type: 4,
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["Connect", "Speak", "ViewChannel", "SendMessages", "EmbedLinks"]
                        },
                        {
                            type: "role",
                            id: interaction.guild.roles.everyone.id,
                            allow: ["ViewChannel"],
                            deny: ["UseApplicationCommands"]
                        }
                    ]
                });

                const textChannel = await interaction.guild.channels.create({
                    name: `${client.user.username}-song-requests`,
                    type: 0,
                    parent: parent.id,
                    topic: "🔉 To decrease 10% volume.\n⏮️ To play the previously played song.\n⏯️ To pause/resume the song.\n⏭️ To skip the song.\n🔊 To increase 10% volume.\n⏪ To rewind 10s seconds.\n♾️To enable/disable autoplay.\n⏹️ To stops/destroy the player.\n🔁 Tp switch between the loop modes (track/queue/shuffle).\n⏩ To forward 10 seconds.",
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"],
                            deny: ["UseApplicationCommands"]
                        },
                        {
                            type: "role",
                            id: interaction.guild.roles.everyone.id,
                            allow: ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"],
                            deny: ["UseApplicationCommands"]

                        }
                    ]
                });

                let rates = [1000 * 64, 1000 * 96, 1000 * 128, 1000 * 256, 1000 * 384];
                let rate = rates[0];

                switch (interaction.guild.premiumTier) {
                    case 0:
                        rate = rates[1];
                        break;

                    case 1:
                        rate = rates[2];
                        break;

                    case 2:
                        rate = rates[3];
                        break;

                    case 3:
                        rate = rates[4];
                        break;
                };

                const voiceChannel = await interaction.guild.channels.create({
                    name: `${client.user.username} Music`,
                    type: 2,
                    parent: parent.id,
                    bitrate: rate,
                    userLimit: 50,
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["Connect", "Speak", "ViewChannel", "RequestToSpeak"],
                        },
                        {
                            type: "role",
                            id: interaction.guild.roles.everyone.id,
                            allow: ["Connect", "ViewChannel"],
                        }
                    ]
                });

                const embed11 = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | Error creating a text channel, please try again later or check my permissions.`)

                if (!textChannel) return interaction.editReply({ embeds: [embed11] });

                const embed12 = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | Error creating a voice channel, please try again later or check my permissions`)

                if (!voiceChannel) return interaction.editReply({ embeds: [embed12] });

                const setupText = await client.channels.cache.get(textChannel.id) || await client.channels.fetch(textChannel.id);

                const msg = await setupText.send({
                    files: [file],
                    embeds: [embed1],
                    components: [row1]
                });

                data = new db({
                    _id: interaction.guildId,
                    category: parent.id,
                    channel: textChannel.id,
                    message: msg.id,
                    voiceChannel: voiceChannel.id,
                    moderator: interaction.user.id,
                    lastUpdated: Math.round(Date.now() / 1000)
                });

                await data.save();
                await interaction.editReply({ content: null, embeds: [new EmbedBuilder().setColor("Random").setThumbnail(client.user.displayAvatarURL({})).setDescription(`**Successfully created a song request channel.**\n\n Song request channel: ${textChannel}\n- *You can rename or move this channel if you want to*.\n\nUse \`/setup delete\`.`)] });
            break;

            case "delete":
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Channels Or Administrator permission to use this command!` });

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Channels Or Administrator permission to use this command!` });

                if (!data) {
                    const embed16 = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.wrong} | The song request channel has not yet been setup.`)
                    return await interaction.editReply({ embeds: [embed16] });
                }

                // i want both declaration to use the handle error with .ccatch

                const parent2 = await interaction.guild.channels.cache.get(data.category) || await interaction.guild.channels.fetch(data.category).catch(e => {});

                const voiceChannel2 = await interaction.guild.channels.cache.get(data.voiceChannel) || await interaction.guild.channels.fetch(data.voiceChannel).catch(e => {});

                const channel2 = await interaction.guild.channels.cache.get(data.channel) || await interaction.guild.channels.fetch(data.channel).catch(e => {});
                
                try {
                    if (parent2) {
                        await parent2.delete();
                    }

                    if (channel2) {
                        await channel2.delete();
                    }

                    if (voiceChannel2) {
                        await voiceChannel2.delete();
                    }
                } catch (e) { };

                await db.deleteMany({ _id: interaction.guildId });

                const embed17 = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.tick} | Successfully deleted the song music request channel data.`)

                await interaction.editReply({ embeds: [embed17] });
            break;

            case "info":
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Manage Channels Or Administrator permission to use this command!` });

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Channels Or Administrator permission to use this command!` });
                
                if (!data) {
                    const embed18 = new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`${client.emoji.wrong} | The song request channel has not yet been setup.`)
                    return await interaction.editReply({ embeds: [embed18] });
                }

                const embed003 = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Setup information")
                .addFields([
                    {
                        name: "Category",
                        value: `<#${data.category}> **(Id: ${data.category})**`,
                        inline: false
                    },
                    {
                        name: "Text channel",
                        value: `<#${data.channel}> **(Id: ${data.channel})**`,
                        inline: false
                    },
                    {
                        name: "Voice channel",
                        value: `<#${data.voiceChannel}> **(Id: ${data.voiceChannel})**`,
                        inline: false
                    },
                    {
                        name: "Setup by",
                        value: `<@${data.moderator}> **(Id: ${data.moderator})**`,
                        inline: false
                    },
                    {
                        name: "Last updated",
                        value: `<t:${data.lastUpdated}>`,
                        inline: false
                    }
                ]);

                await interaction.editReply({ embeds: [embed003] });
            break;
        }
    }
};