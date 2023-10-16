const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder } = require("discord.js");
const { CapitalizeText } = require("../../../Utils/Utils.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of all commands.")
    .addStringOption(option => option
        .setName("command")
        .setDescription("The command to get specific information of.")
        .setRequired(false)
        .setAutocomplete(true)
    ),
    async autocomplete(interaction) {
        const value = interaction.options.getFocused().toLowerCase();
        const filteed = interaction.client.helpArray.filter(choice => choice.toLowerCase().includes(value));
        const filtered = filteed.slice(0, 25);

        if (!interaction) return;

        await interaction.respond(
            filtered.map(choice => ({ name: CapitalizeText(choice), value: choice }))
        )
    },
    run: async (client, interaction) => {
        const cmd = interaction.options.getString("command");
      
        if (cmd) {
            const SlashCommands = client.slashCommands.get(cmd);

            if (SlashCommands) {
                 if (!interaction.replied) await interaction.deferReply();
              
                 const embed = new EmbedBuilder()
                .setAuthor({ name: `Zeon`,  iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`\`\`\`diff\n- [] = optional argument\n- <> = required argument\n- Do NOT type these when using commands!\`\`\`\n> ${SlashCommands.SlashData.description}`)
                .setColor("Random")
                .addFields(
                  { name: `Usage`, value: `\`\`\`${SlashCommands.usage ? SlashCommands.usage : "No Usage Mentioned"}\`\`\``, inline: false }
                )

                return interaction.editReply({ embeds: [embed] })
            } else {
                
            }
        }
        if (!interaction.replied) await interaction.deferReply();

        const helpembed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setColor("Random")
        .setDescription(`• Slash Commands Only \`/\`\n• [Get Zeon](${client.config.Bot.Invite}) | [Dashboard](${client.config.Dashboard.Information.Domain}) | [Support server](${client.config.Bot.SupportServer}) | [Vote me](${client.config.BotList.TopGG.LinkToVote})\n• Type \`/help [command | module]\` for more info.`)
        .addFields(
            { 
                name: "__Main__",  
                value: `${client.emoji.automod} Automod\n${client.emoji.gear} Configuration\n${client.emoji.fun} Fun\n${client.emoji.images} Images\n${client.emoji.info} Information\n${client.emoji.gift} Giveaway\n${client.emoji.mod} Moderation\n${client.emoji.jointocreate} Join To Create\n${client.emoji.ticket} Ticket\n${client.emoji.counting} Counting\n${client.emoji.utility} Utility`, 
                inline: true 
            },            { 
                name: "__Extra__", 
                value: `${client.emoji.music} Music`,
                inline: true
            }
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: `Made With 💖 By The CodeSource | Development Team`, iconURL: client.user.displayAvatarURL() })
    
        const menu = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`Scroll The Help Menu!`)
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Home")
            .setValue("Home")
            .setEmoji(client.emoji.home),
            new StringSelectMenuOptionBuilder()
            .setLabel("AutoMod")
            .setValue("Automod")
            .setEmoji(client.emoji.automod),
            new StringSelectMenuOptionBuilder()
            .setLabel("Configuration")
            .setValue("Config")
            .setEmoji(client.emoji.gear),
            new StringSelectMenuOptionBuilder()
            .setLabel("Fun")
            .setValue("Fun")
            .setEmoji(client.emoji.fun),
            new StringSelectMenuOptionBuilder()
            .setLabel("Images")
            .setValue("Images")
            .setEmoji(client.emoji.images),
            new StringSelectMenuOptionBuilder()
            .setLabel("Information")
            .setValue("Info")
            .setEmoji(client.emoji.info),
            new StringSelectMenuOptionBuilder()
            .setLabel("Giveaway")
            .setValue("gw")
            .setEmoji(client.emoji.gift),
            new StringSelectMenuOptionBuilder()
            .setLabel("Moderation")
            .setValue("Mod")
            .setEmoji(client.emoji.mod),
            new StringSelectMenuOptionBuilder()
            .setLabel("Join To Create")
            .setValue("jointocreate")
            .setEmoji(client.emoji.jointocreate),
            new StringSelectMenuOptionBuilder()
            .setLabel("Ticket")
            .setValue("ticket")
            .setEmoji(client.emoji.ticket),
            new StringSelectMenuOptionBuilder()
            .setLabel("Counting")
            .setValue("counting")
            .setEmoji(client.emoji.counting),
            new StringSelectMenuOptionBuilder()
            .setLabel("Utility")
            .setValue("utility")
            .setEmoji(client.emoji.utility),
            new StringSelectMenuOptionBuilder()
            .setLabel("Music")
            .setValue("music")
            .setEmoji(client.emoji.music)
        );
        
        const Ended = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setDisabled(true)
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`HelpMenu Has Been Expired!`)
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Home")
            .setValue("Home")
            .setEmoji(client.emoji.home),
            new StringSelectMenuOptionBuilder()
            .setLabel("AutoMod")
            .setValue("Automod")
            .setEmoji(client.emoji.automod),
            new StringSelectMenuOptionBuilder()
            .setLabel("Configuration")
            .setValue("Config")
            .setEmoji(client.emoji.gear),
            new StringSelectMenuOptionBuilder()
            .setLabel("Fun")
            .setValue("Fun")
            .setEmoji(client.emoji.fun),
            new StringSelectMenuOptionBuilder()
            .setLabel("Images")
            .setValue("Images")
            .setEmoji(client.emoji.images),
            new StringSelectMenuOptionBuilder()
            .setLabel("Information")
            .setValue("Info")
            .setEmoji(client.emoji.info),
            new StringSelectMenuOptionBuilder()
            .setLabel("Giveaway")
            .setValue("gw")
            .setEmoji(client.emoji.gift),
            new StringSelectMenuOptionBuilder()
            .setLabel("Moderation")
            .setValue("Mod")
            .setEmoji(client.emoji.mod),
            new StringSelectMenuOptionBuilder()
            .setLabel("Join To Create")
            .setValue("jointocreate")
            .setEmoji(client.emoji.jointocreate),
            new StringSelectMenuOptionBuilder()
            .setLabel("Ticket")
            .setValue("ticket")
            .setEmoji(client.emoji.ticket),
            new StringSelectMenuOptionBuilder()
            .setLabel("Counting")
            .setValue("counting")
            .setEmoji(client.emoji.counting),
            new StringSelectMenuOptionBuilder()
            .setLabel("Utility")
            .setValue("utility")
            .setEmoji(client.emoji.utility),
            new StringSelectMenuOptionBuilder()
            .setLabel("Music")
            .setValue("music")
            .setEmoji(client.emoji.music)
        );
        
        const row = new ActionRowBuilder()
        .addComponents(menu);

        const rowbut = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.backforward)
            .setCustomId('backk'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonleft)
            .setCustomId('prevv'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonstop)
            .setCustomId('stopp'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonright)
            .setCustomId('nextt'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.frontbackward)
            .setCustomId('frontt')
        );

        const rowbut3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.backforward)
            .setCustomId('backk')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonleft)
            .setCustomId('prevv')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonstop)
            .setCustomId('stopp'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonright)
            .setCustomId('nextt'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.frontbackward)
            .setCustomId('frontt')
        );

        const rowbut4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.backforward)
            .setCustomId('backk'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonleft)
            .setCustomId('prevv'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonstop)
            .setCustomId('stopp'),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonright)
            .setCustomId('nextt')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.frontbackward)
            .setCustomId('frontt')
            .setDisabled(true)
        );

        const rowbutlink = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Link")
            .setLabel("Invite Zeon")
            .setURL(client.config.Bot.Invite),
            new ButtonBuilder()
            .setStyle("Link")
            .setLabel("Support Server")
            .setURL(client.config.Bot.SupportServer),
            new ButtonBuilder()
            .setStyle("Link")
            .setLabel("Vote Me!")
            .setURL(client.config.BotList.TopGG.LinkToVote)
        );
        
        const row2 = new ActionRowBuilder()
        .addComponents(Ended);

        const rowbut2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.backforward)
            .setCustomId('backk')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonleft)
            .setCustomId('prevv')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonstop)
            .setCustomId('stopp')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.buttonright)
            .setCustomId('nextt')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji(client.emoji.frontbackward)
            .setCustomId('frontt')
            .setDisabled(true)
        );

        const automod = new EmbedBuilder().setColor("Random").setDescription(`\`automod flagged-words\`, \`automod keyword\`, \`automod mention-spam\`, \`automod spam-messages\``).setTitle("AutoMod Commands").setFooter({text: `Total 4 AutoMod Commands.`});

        const Config = new EmbedBuilder().setColor("Random").setDescription(`\`botcommandchannel setup\`, \`botcommandchannel de-setup\`, \`premium redeem\`, \`premium status\``).setTitle("Configuration Commands").setFooter({text: `Total 4 Configuration Commands.`});

        const Fun = new EmbedBuilder().setColor("Random").setDescription(`\`8ball\`, \`ascii\`, \`cattext\`, \`coinflip\`, \`dice\`, \`dinochrome\`, \`google\`, \`hangman\`, \`impersonate\`, \`meme\`, \`pokedex\`, \`random answer\`, \`texttospeech\`, \`tic-tac-toe\``).setTitle("Fun Commands").setFooter({text: `Total 14 Information Commands.`});

        const Images = new EmbedBuilder().setColor("Random").setDescription(`\`achievement\`, \`advertisement\`, \`affect\`, \`batslap\`, \`beautiful\`, \`blur\`, \`bobross\`, \`delete\`, \`gay\`, \`hitler\`, \`jail\`, \`poutine\`, \`rip\`, \`trash\`, \`triggered\`, \`wanted\``).setTitle("Images Commands").setFooter({text: `Total 16 Images Commands.`});

        const Info = new EmbedBuilder().setColor("Random").setDescription(`\`help\`, \`invite\`, \`membercount\`, \`ping\`, \`role info\`, \`server info\`, \`shards\`, \`statistics\`, \`voice info\`, \`time\`, \`uptime\`, \`user info\`, \`user profile\`, \`worldclock\`, \`vote\``).setTitle("Information Commands").setFooter({text: `Total 15 Information Commands.`});

        const gw = new EmbedBuilder().setColor("Random").setDescription(`\`giveaway start\`, \`giveaway edit\`, \`giveaway end\`, \`giveaway reroll\`, \`giveaway pause\`, \`giveaway resume\``).setTitle("Giveaway Commands").setFooter({text: `Total 6 Giveaway Commands.`});

        const Mod = new EmbedBuilder().setColor("Random").setDescription(`\`ban\`, \`kick\`, \`lock\`, \`unlock\`, \`mass-unban\`, \`nuke\`, \`purge\`, \`role all\`, \`nickname\`, \`slowmode\`, \`timeout\`, \`untimeout\`, \`voice kick\`, \`voice deafen\`, \`voice undeafen\`, \`voice mute\`, \`voice unmute\`, \`voice list\`, \`voice move\``).setTitle("Moderation Commands").setFooter({text: `Total 19 Moderation Commands.`});

        const jointocreate = new EmbedBuilder().setColor("Random").setDescription(`\`jointocreate setup\`, \`jointocreate de-setup\``).setTitle("Join To Create Commands").setFooter({text: `Total 2 Join To Create Commands.`});

        const ticket = new EmbedBuilder().setColor("Random").setDescription(`\`ticket setup\`, \`ticket de-setup\``).setTitle("Ticket Commands").setFooter({text: `Total 2 Ticket Commands.`})

        const counting = new EmbedBuilder().setColor("Random").setDescription(`\`counting game setup\`, \`counting game de-setup\`. \`counting user block\`, \`counting user unblock\``).setTitle("Counting Commands").setFooter({text: `Total 4 Counting Commands.`})

        const Utility = new EmbedBuilder().setColor("Random").setDescription(`\`afk\`, \`server icon\`,  \`user avatar\`, \`banner\`, \`calculator\`, \`enlarge\`, \`snipe\`, \`translate\`, \`wikipedia search\``).setTitle("Utility Commands").setFooter({text: `Total 9 Utility Commands.`});

        const Music = new EmbedBuilder().setColor("Random").setDescription(`\`247\`, \`clearqueue\`, \`fixvoice\`, \`grab\`, \`join\`, \`leave\`, \`lyrics\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`replay\`, \`resume\`, \`skip\`, \`setup create\`, \`setup delete\`, \`setup info\`, \`volume\``).setFooter({text: `Total 18 Music Commands.`});
        
        await interaction.editReply({ embeds: [helpembed], components: [rowbut3, row, rowbutlink] });
        
        const filter = (int) => {
            if (int.user.id === interaction.user.id) return true;
            return int.reply({
                content: `${client.emoji.wrong} | **Only ${interaction.user.tag} can use this interaction!**`,
                ephemeral: true,
            });
        };
    
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 60000,
            idle: 60000 / 2,
        });

        const pages = [ helpembed, automod, Config, Fun, Images, Info, gw, Mod, jointocreate, ticket, counting, Utility, Music ];

        let currentPage = 0;
    
        collector.on("collect", async (int) => {
            if (!int.deferred) await int.deferUpdate();

            if (int.customId === "backk") {
                currentPage = 0;
                interaction.editReply({ embeds: [pages[currentPage]], components: [rowbut3, row, rowbutlink] });
            } else if (int.customId === "prevv") {
                if (currentPage === 0) currentPage = pages.length - 1;
                else currentPage--;
                if (currentPage === 0) {
                    interaction.editReply({ embeds: [pages[currentPage]], components: [rowbut3, row, rowbutlink] });
                } else {
                    interaction.editReply({ embeds: [pages[currentPage]], components: [rowbut, row, rowbutlink] });
                }
            } else if (int.customId === "stopp") {
                await collector.stop();
            } else if (int.customId === "nextt") {
                if (currentPage === pages.length - 1) currentPage = 0;
                else currentPage++;
                const cur = pages.length - 1
                if (currentPage === cur) {
                    interaction.editReply({ embeds: [pages[currentPage]], components: [rowbut4, row, rowbutlink] });
                } else {
                    interaction.editReply({ embeds: [pages[currentPage]], components: [rowbut, row, rowbutlink] });
                }
            } else if (int.customId === "frontt") {
                currentPage = pages.length - 1;
                interaction.editReply({ embeds: [pages[currentPage]], components: [rowbut4, row, rowbutlink] });
            } else if (int.values[0] === 'Home') {
                currentPage = 0;
                interaction.editReply({ embeds: [helpembed], components: [rowbut, rowbut3, rowbutlink] });
            } else if (int.customId === "Automod") {
                currentPage = 1;
                interaction.editReply({ embeds: [automod], components: [rowbut, row, rowbutlink] })
            } else if (int.values[0] === 'Config') {
                currentPage = 2;
                interaction.editReply({ embeds: [Config], components: [rowbut, row, rowbutlink] });
            } else if (int.values[0] === 'Fun') {
                currentPage = 3;
                interaction.editReply({ embeds: [Fun], components: [rowbut, row, rowbutlink] });
            } else if (int.customId === "Images") {
                currentPage = 4;
                interaction.editReply({ embeds: [Images], components: [rowbut, row, rowbutlink] })
            } else if (int.values[0] === 'Info') {
                currentPage = 5;
                interaction.editReply({ embeds: [gw], components: [rowbut, row, rowbutlink] })
            } else if (int.values[0] === 'gw') {
                currentPage = 6;
                interaction.editReply({ embeds: [gw], components: [rowbut, row, rowbutlink] })
            } else if (int.values[0] === 'Mod') {
                currentPage = 7;
                interaction.editReply({ embeds: [Mod] });
            } else if (int.values[0] === 'jointocreate') {
                currentPage = 8;
                interaction.editReply({ embeds: [jointocreate], components: [rowbut, row, rowbutlink] });
            } else if (int.values[0] === 'ticket') {
                currentPage = 9;
                interaction.editReply({ embeds: [ticket], components: [rowbut, row, rowbutlink] });
            } else if (int.values[0] === 'counting') {
                currentPage = 10;
                interaction.editReply({ embeds: [counting] });
            } else if (int.values[0] === 'Utility') {
                currentPage = 11;
                interaction.editReply({ embeds: [Utility], components: [rowbut, rowbut4, rowbutlink] });
            } else if (int.values[0] === 'music') {
                currentPage = 12;
                interaction.editReply({ embeds: [Music], components: [rowbut, row, rowbutlink] });
            }
        })
    
        collector.on("end", () => {
            return interaction.editReply({ components: [rowbut2, row2, rowbutlink] })
        })
    }  
};