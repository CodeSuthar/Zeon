const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");
const e = require("express");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of all commands."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const helpembed = new EmbedBuilder()
        .setTitle(`${client.user.username}'s Help Page`)
        .setColor("Random")
        .setDescription(`**Hey <@${interaction.user.id}> 👋, I'm <@${client.user.id}> , The Best Multifunctional Discord Bot Of To Make Dream Of Your Server Come True. Find Out What I Can Do Using The Dropdown Menu Below.**`)
        .addFields(
            { name: "___Commands Categories are Listed Below___",  value: `${client.emoji.automod} \`:\` **Automod**\n${client.emoji.gear} \`:\` **Configuration**\n${client.emoji.fun} \`:\` **Fun**\n${client.emoji.info} \`:\` **Information**\n${client.emoji.mod} \`:\` Moderation\n${client.emoji.jointocreate} \`:\` Join To Create\n${client.emoji.system} \`:\` Setup\n${client.emoji.ticket} \`:\` Ticket\n${client.emoji.counting} \`:\` Counting\n${client.emoji.utility} \`:\` Utility\n\n • *Select Category From Below Menu*`},
            { name: "___Links___",  value: `[Vote](https://top.gg/bot/969558840926437406/vote) • [Dashboard](https://zeon.code-source.tech) • [Support Server](https://discord.gg/C7PJbvjECt) • [Creavite](https://crvt.co/b)`}
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: `Helping You Is My Pleasure <3`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
    
        const menu = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`Scroll The Help Menu!`)
        .addOptions([
            {
                label: "Home",
                value: "Home",
                emoji: client.emoji.home
            },
            {
                label: "AutoMod",
                value: "Automod",
                emoji: client.emoji.automod
            },
            {
                label: "Configuration",
                value: "Config",
                emoji: client.emoji.gear
            },
            {
                label: "Fun",
                value: "Fun",
                emoji: client.emoji.fun
            },
            {
                label: "Information",
                value: "Info",
                emoji: client.emoji.info
            },
            {
                label: "Moderation",
                value: "Mod",
                emoji: client.emoji.mod
            },
            {
                label: "Join To Create",
                value: "jointocreate",
                emoji: client.emoji.jointocreate
            },
            {
                lable: "Ticket",
                value: "ticket",
                emoji: client.emoji.ticket
            },
            {
                name: "Counting",
                value: "counting",
                emoji: client.emoji.counting
            },
            {
                label: "Utility",
                value: "Utility",
                emoji: client.emoji.utility
            }
        ]);
        
        const Ended = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setDisabled(true)
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`HelpMenu Has Been Expired!`)
        .addOptions([
            {
                label: "Home",
                value: "Home",
                emoji: client.emoji.home
            },
            {
                label: "AutoMod",
                value: "Automod",
                emoji: client.emoji.automod
            },
            {
                label: "Configuration",
                value: "Config",
                emoji: client.emoji.gear
            },
            {
                label: "Fun",
                value: "Fun",
                emoji: client.emoji.fun
            },
            {
                label: "Information",
                value: "Info",
                emoji: client.emoji.info
            },
            {
                label: "Moderation",
                value: "Mod",
                emoji: client.emoji.mod
            },
            {
                label: "Join To Create",
                value: "jointocreate",
                emoji: client.emoji.jointocreate
            },
            {
                lable: "Ticket",
                value: "ticket",
                emoji: client.emoji.ticket
            },
            {
                name: "Counting",
                value: "counting",
                emoji: client.emoji.counting
            },
            {
                label: "Utility",
                value: "Utility",
                emoji: client.emoji.utility
            }
        ]);
        
        const row = new ActionRowBuilder()
        .addComponents(menu);

        const rowbut = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Danger")
            .setEmoji("◀")
            .setCustomId('prev'),
            new ButtonBuilder()
            .setStyle("Success")
            .setEmoji("▶")
            .setCustomId('next')
        );
        
        const row2 = new ActionRowBuilder()
        .addComponents(Ended);

        const rowbut2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle("Danger")
            .setEmoji("◀")
            .setCustomId('prev')
            .setDisabled(true),
            new ButtonBuilder()
            .setStyle("Success")
            .setEmoji("▶")
            .setCustomId('next')
            .setDisabled(true)
        );

        const automod = new EmbedBuilder().setColor("Random").setDescription(`\`automod flagged-words\`, \`automod keyword\`, \`automod mention-spam\`, \`automod spam-messages\``)

        const Config = new EmbedBuilder().setColor("Random").setDescription(`\`botcommandchannel setup\`, \`botcommandchannel de-setup\`, \`premium redeem\`, \`premium status\``).setTitle("Configuration Commands").setFooter({text: `Total 4 Configuration Commands.`});

        const Fun = new EmbedBuilder().setColor("Random").setDescription(`\`8ball\`, \`ascii\`, \`coinflip\`, \`dice\`, \`google\`, \`hangman\`, \`impersonate\`, \`meme\`, \`random answer\`, \`texttospeech\`, \`tic-tac-toe\``).setTitle("Fun Commands").setFooter({text: `Total 11 Information Commands.`});

        const Info = new EmbedBuilder().setColor("Random").setDescription(`\`help\`, \`membercount\`, \`ping\`, \`profile\`, \`roleinfo\`, \`servericon\`, \`serverinfo\`, \`shards\`, \`statistics\`, \`time\`, \`uptime\`, \`userinfo\``).setTitle("Information Commands").setFooter({text: `Total 12 Information Commands.`});

        const Mod = new EmbedBuilder().setColor("Random").setDescription(`\`ban\`, \`kick\`, \`lock\`, \`mass-unban\`, \`purge\`, \`setnick\`, \`slowmode\`, \`timeout\`, \`unlock\`, \`untimeout\`, \`voice kick\`, \`voice deafen\`, \`voice undeafen\`, \`voice mute\`, \`voice unmute\`, \`voice list\``).setTitle("Moderation Commands").setFooter({text: `Total 16 Moderation Commands.`});

        const jointocreate = new EmbedBuilder().setColor("Random").setDescription(`\`jointocreate setup\`, \`jointocreate de-setup\``).setTitle("Join To Create Commands").setFooter({text: `Total 2 Join To Create Commands.`});

        const ticket = new EmbedBuilder().setColor("Random").setDescription(`\`ticket setup\`, \`ticket de-setup\``).setTitle("Ticket Commands").setFooter({text: `Total 2 Ticket Commands.`})

        const counting = new EmbedBuilder().setColor("Random").setDescription(`\`counting game setup\`, \`counting game de-setup\`. \`counting user block\`, \`counting user unblock\``).setTitle("Counting Commands").setFooter({text: `Total 4 Counting Commands.`})

        const Utility = new EmbedBuilder().setColor("Random").setDescription(`\`afk\`, \`avatar\`, \`banner\`, \`calculator\`, \`enlarge\`, \`translate\`, \`wikipedia search\``).setTitle("Utility Commands").setFooter({text: `Total 7 Utility Commands.`});
        
        await interaction.editReply({ embeds: [helpembed], components: [row, rowbut] });
        
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

        const pages = [ helpembed, automod, Config, Fun, Info, Mod, jointocreate, ticket, counting, Utility ];

        let currentPage = 0;
    
        collector.on("collect", async (int) => {
            if (!int.deferred) await int.deferUpdate();

            if (int.customId === "prev") {
                if (currentPage === 0) currentPage = pages.length - 1;
                else currentPage--;
                interaction.editReply({ embeds: [pages[currentPage]] });
                
            } else if (int.customId === "next") {
                if (currentPage === pages.length - 1) currentPage = 0;
                else currentPage++;
                interaction.editReply({ embeds: [pages[currentPage]] });
                
            } else if (int.values[0] === 'Home') {
                currentPage = 0;
                interaction.editReply({ embeds: [helpembed] });
            } else if (int.customId === "Automod") {
                currentPage = 1;
                interaction.editReply({ embeds: [automod] })
            } else if (int.values[0] === 'Config') {
                currentPage = 2;
                interaction.editReply({ embeds: [Config] });
            } else if (int.values[0] === 'Fun') {
                currentPage = 3;
                interaction.editReply({ embeds: [Fun] });
            } else if (int.values[0] === 'Info') {
                currentPage = 4;
                interaction.editReply({ embeds: [Info] })
            } else if (int.values[0] === 'Mod') {
                currentPage = 5;
                interaction.editReply({ embeds: [Mod] });
            } else if (int.values[0] === 'jointocreate') {
                currentPage = 6;
                interaction.editReply({ embeds: [jointocreate] });
            } else if (int.values[0] === 'ticket') {
                currentPage = 7;
                interaction.editReply({ embeds: [ticket] });
            } else if (int.values[0] === 'counting') {
                currentPage = 8;
                interaction.editReply({ embeds: [counting] });
            } else if (int.values[0] === 'Utility') {
                currentPage = 7;
                interaction.editReply({ embeds: [Utility] });
            }
        })
    
        collector.on("end", () => {
            return interaction.editReply({ components: [row2, rowbut2] })
        })
    }  
};