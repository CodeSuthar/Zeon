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

/* import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command, Lavamusic, Context } from '../../structures/index';
import { Song } from '../../structures/Dispatcher';

export default class Search extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: 'search',
      description: {
        content: 'Searches for a song',
        examples: ['search', 'search <song>'],
        usage: 'search',
      },
      category: 'music',
      aliases: ['search'],
      cooldown: 3,
      args: true,
      player: {
        voice: true,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
        user: [],
      },
      slashCommand: true,
      options: [
        {
          name: 'song',
          description: 'The song you want to search',
          type: 3,
          required: true,
        },
      ],
    });
  }
  public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
    const embed = client.embed().setColor(client.color.main);
    let player = client.queue.get(ctx.guild.id);
    const query = args.join(' ');
    if (!player) {
      const vc = ctx.member as any;
      player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel, client.shoukaku.getNode());
    }
    const res = await this.client.queue.search(query);
    if (!res)
      return ctx.sendMessage({
        embeds: [embed.setDescription(`**No results found**`).setColor(client.color.red)],
      });
    let msg: any;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('1').setLabel('1').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('2').setLabel('2').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('3').setLabel('3').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('4').setLabel('4').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('5').setLabel('5').setStyle(ButtonStyle.Primary),
    );
    switch (res.loadType) {
      case 'LOAD_FAILED':
        ctx.sendMessage({
          embeds: [embed.setColor(this.client.color.red).setDescription('There was an error while searching.')],
        });
        break;
      case 'NO_MATCHES':
        ctx.sendMessage({
          embeds: [embed.setColor(this.client.color.red).setDescription('There were no results found.')],
        });
        break;
      case 'SEARCH_RESULT':
        const tracks = res.tracks.slice(0, 5);
        const embeds = tracks.map(
          (track: Song, index: number) =>
            `${index + 1}. [${track.info.title}](${track.info.uri}) - \`${track.info.author}\``,
        );
        msg = await ctx.sendMessage({
          embeds: [embed.setDescription(embeds.join('\n'))],
          components: [row],
        });
        break;
    }
    const collector = ctx.channel.createMessageComponentCollector({
      filter: (f: any) => (f.user.id === ctx.author.id ? true : false && f.deferUpdate()),
      max: 1,
      time: 60000,
      idle: 60000 / 2,
    });
    collector.on('collect', async (int: any) => {
      for (let i = 0; i < res.tracks.length; i++) {
        if (int.customId === `${i + 1}`) {
          let track = res.tracks[i];
          track = player.buildTrack(track, ctx.author);
          player.queue.push(track);
          player.isPlaying();
          await ctx.editMessage({
            embeds: [embed.setDescription(`Added [${track.info.title}](${track.info.uri}) to the queue`)],
            components: [],
          });
        }
      }
      return await int.deferUpdate();
    });

    collector.on('end', async () => {
      await ctx.editMessage({ components: [] });
    });
  }
} */

/* const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    name: "search",
    category: "Music",
    description: "plays music from query",
    usage: "search <query>",
    cooldown: 5,
    execute: async (message, args, SynthBot, prefix) => {

        let queue = SynthBot.manager.getQueue(message.guild.id);
        
        if (!message.member.voice.channelId) {
            const embed = new EmbedBuilder()
            .setDescription("You Are Not Connected To A Voice Channed!")
            .setColor("Random")
            return message.reply({ embeds: [embed] })
        }
    
        if (queue && queue.connection.channel.id !== message.member.voice.channelId) {
            const embed = new EmbedBuilder()
            .setDescription(`I'm Already Connected To <#${queue.connection.channel.id}> Voice Channel, I Can't Betray <#${queue.connection.channel.id}>!`)
            .setColor("Random")
            return message.reply({ embeds: [embed] })
        }
    
        if (!queue) {
            const vc = message.member.voice.channel;
            queue = await SynthBot.manager.createQueue(message.guildId, {
                leaveOnEnd: false,
                leaveOnStop: false,
                initialVolume: 80,
                bufferingTimeout: 200,
                metadata: {
                    guild: message.guild.id,
                    channel: message.channel.id
                }
            })
            if (!queue.connection) queue.connect(vc)
        }
    
        const searchquery = args.join(" ");
    
        if (!searchquery) {
            const embed = new EmbedBuilder()
            .setDescription(`You Need To Provide Me Song Query, To Search The Track!`)
            .setColor("Random")
            return message.reply({ embeds: [embed] })
        }
    
        const song = await SynthBot.manager.search(searchquery, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        });
        
        await message.reply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`Searching for **${searchquery}**`)]}).then((msg) =>{
    
            if (!song || !song.tracks.length) return message.reply({ content: 'No results were found!' });
            
            try {
                const searched = new EmbedBuilder()       
                .setDescription("Select the track you want to add to the queue by the menu below.")
                .setColor("Random");
    
                const menu = new SelectMenuBuilder()
                .setCustomId('menu')
                .setMinValues(1)
                .setMaxValues(1)
                .setPlaceholder(`Click here to choose a track`)
                .addOptions([
                    {
                        label: `${song.tracks[0].title}`,
                        value: "search_one"
                    },
                    {
                        label: `${song.tracks[1].title}`,
                        value: "search_two"
                    },
                    {
                        label: `${song.tracks[2].title}`,
                        value: "search_three"
                    },
                    {
                        label: `${song.tracks[3].title}`,
                        value: "search_four"
                    },
                    {
                        label: `${song.tracks[4].title}`,
                        value: "search_five",
                    }
                ])
        
                const menu2 = new SelectMenuBuilder()
                .setCustomId('menu2')
                .setMinValues(1)
                .setMaxValues(1)
                .setPlaceholder(`Interaction disabled`)
                .setDisabled(true)
                .addOptions([
                    {
                        label: `Interaction disabled`,
                        description: `Interaction disabled`,
                        value: "Interaction disabled"
                    }
                ])
        
                const row = new ActionRowBuilder()
                .addComponents(menu)
        
                const row2 = new ActionRowBuilder()
                .addComponents(menu2)
        
                msg.edit({embeds: [searched], components: [row] });
        
                const search = new EmbedBuilder()
                .setColor("Random");
                
                const collector = msg.createMessageComponentCollector({
                    filter: (interaction) => {
                        if (interaction.user.id === message.author.id) {
                            return true;
                        } else {
                            interaction.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this help menu, if you want to use it then you have to run the help command again.`});
                            return false;
                        };
                    },
                    max: 1,
                    time : 60000,
                    idle: 60000
                });
    
                collector.on("end", async () => {
                    if (msg) return msg.edit({ components: [row2] })
                })
        
                collector.on("collect", async (interaction) => {
                    const playlist = SynthBot.emoji.playlist;
                    if (!interaction.deferred) interaction.deferUpdate().catch(() => {})
                    const selected = interaction.values[0]
                    if (selected === "search_one") {
                        queue.addTrack(song.tracks[0]);
                        if (!Queue.node.isPlaying()) Queue.node.play();
          
                        if(msg) return msg.edit({embeds: [search.setDescription(`${playlist} Queued [${song.tracks[0].title}](${song.tracks[0].url})`)]})
                    }
                    if (selected === "search_two") {
                        queue.addTrack(song.tracks[1]);
                        if (!Queue.node.isPlaying()) Queue.node.play();
          
                        if (msg) return msg.edit({embeds: [search.setDescription(`${playlist} Queued [${song.tracks[1].title}](${song.tracks[1].url})`)]})
                    }
                    if (selected === "search_three") {
                        queue.addTrack(song.tracks[2]);
                        if (!Queue.node.isPlaying()) Queue.node.play();
        
                        if (msg) return msg.edit({embeds: [search.setDescription(`${playlist} Queued [${song.tracks[2].title}](${song.tracks[2].url})`)]})
                    }
                    if (selected === "search_four") {
                        queue.addTrack(song.tracks[3]);
                        if (!Queue.node.isPlaying()) Queue.node.play();
          
                        if (msg) return msg.edit({embeds: [search.setDescription(`${playlist} Queued [${song.tracks[3].title}](${song.tracks[3].url})`)]})
                    }
                    if (selected === "search_five") {
                        queue.addTrack(song.tracks[4]);
                        if (!Queue.node.isPlaying()) Queue.node.play();
        
                        if (msg) return msg.edit({embeds: [search.setDescription(`${playlist} Queued [${song.tracks[4].title}](${song.tracks[4].url})`)]})
                    }
                })  
            } catch (e) {
                console.log(e)
                return message.reply({ content: `Can't Load The Track` })
            }
        })
    }
} */