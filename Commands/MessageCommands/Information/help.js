const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "help",
    category: "Information",
    description: "to see the commands",
    usage: "help or help [command]",
    run: async (message, args, client, prefix) => {
        
        let query = args.join(" ");
    
        if (query) {
            const command = client.commands.get(query)
            if (command) {
                const embed = new EmbedBuilder()
                .setAuthor({ name: `${query} command information`,  iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setColor("Random")
                .addFields(
                  { name: `\u200b`, value: `\`\`\`diff\n- [] = optional argument\n\n- <> = required argument\n\n- Do NOT type these when using commands!\`\`\`` },
                  { name: `Name:`, value: `\`\`\`${command.name}\`\`\`` },
                  { name: `Category:`, value: `\`\`\`${command.category}\`\`\``, inline: true },
                  { name: `Description:`, value: `\`\`\`${command.description}\`\`\``, inline: true },
                  { name: `Usage:`, value: `\`\`\`${command.usage}\`\`\``, inline: true },
                )
                return message.reply({ embeds: [embed] })
            } else {
              return message.reply({ content: `You Need To Give A Valid Command To Get Information.` })
            }
        }

        const helpembed = new EmbedBuilder()
        .setTitle(`${client.user.username}'s Help Page`)
        .setColor("Random")
        .setDescription(`**Hey <@${message.author.id}> 👋, I'm <@${client.user.id}> , The Best Multifunctional Discord Bot Of To Make Dream Of Your Server Come True. Find Out What I Can Do Using The Dropdown Menu Below.**`)
        .addFields(
            { name: "___Commands Categories are Listed Below___",  value: `${client.emoji.gear}  \`:\`  **Configuration**\n${client.emoji.gift} \`:\` **Giveaway**\n${client.emoji.info} \`:\` **Information**\n${client.emoji.mod} \`:\` Moderation\n${client.emoji.dev} \`:\` Developer\n${client.emoji.fun} \`:\` Fun\n${client.emoji.volume} \`:\` Soundboard\n${client.emoji.system} \`:\` Setup System\n${client.emoji.utility} \`:\` Utility\n\n • *Select Category From Below Menu*`},
            { name: "___Links___",  value: `[Vote](https://top.gg/bot/969558840926437406/vote) • [Dashboard](https://zeonbot.xyz) • [Support Server](https://discord.gg/aiohttp) • [InfinityNodes](https://infinitynodes.org)`}
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
                label: "Configuration",
                value: "Config",
                emoji: client.emoji.gear
            },
            {
                label: "Giveaway",
                value: "GW",
                emoji: client.emoji.gift
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
                label: "Developer",
                value: "Developer",
                emoji: client.emoji.dev
            },
            {
                label: "Fun",
                value: "Fun",
                emoji: client.emoji.fun
            },
            {
                label: "Soundboard",
                value: "Soundboard",
                emoji: client.emoji.volume
            },
            {
                label: "Setup Systems",
                value: "Setup",
                emoji: client.emoji.system
            },
            {
                label: "Utility",
                value: "Utility",
                emoji: client.emoji.utility
            },
        ]);
        
        const Ended = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setDisabled(true)
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`HelpMenu Has Been Expired!`)
        .addOptions([
            {
                label: "Can't Use It Lol",
                description: "Disabled",
                value: "disabled",
            },
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

        const _commands = client.commands.filter((x) => x.category && x.category === "Configuration").map((x) => `\`${x.name}\``);
        const Config = new EmbedBuilder().setColor("Random").setDescription(_commands.join(", ")).setTitle("Configuration Commands").setFooter({text: `Total ${_commands.length} Configuration Commands.`});

        const _commands2 = client.commands.filter((x) => x.category && x.category === "Giveaway").map((x) => `\`${x.name}\``);
        const GW = new EmbedBuilder().setColor("Random").setDescription(_commands2.join(", ")).setTitle("Giveaway Commands").setFooter({text: `Total ${_commands2.length} Configuration Commands.`});

        const _commands3 = client.commands.filter((x) => x.category && x.category === "Information").map((x) => `\`${x.name}\``);
        const Info = new EmbedBuilder().setColor("Random").setDescription(_commands3.join(", ")).setTitle("Information Commands").setFooter({text: `Total ${_commands3.length} Information Commands.`});

        const _commands4 = client.commands.filter((x) => x.category && x.category === "Moderation").map((x) => `\`${x.name}\``);
        const Mod = new EmbedBuilder().setColor("Random").setDescription(_commands4.join(", ")).setTitle("Moderation Commands").setFooter({text: `Total ${_commands4.length} Moderation Commands.`});

        const _commands5 = client.commands.filter((x) => x.category && x.category === "Developer").map((x) => `\`${x.name}\``);
        const Developer = new EmbedBuilder().setColor("Random").setDescription(_commands5.join(", ")).setTitle("Developer Commands").setFooter({text: `Total ${_commands5.length} Developer Commands.`});

        const _commands6 = client.commands.filter((x) => x.category && x.category === "Fun").map((x) => `\`${x.name}\``);
        const Fun = new EmbedBuilder().setColor("Random").setDescription(_commands6.join(", ")).setTitle("Fun Commands").setFooter({text: `Total ${_commands6.length} Fun Commands.`});

        const _commands7 = client.commands.filter((x) => x.category && x.category === "Soundboard").map((x) => `\`${x.name}\``);
        const Soundboard = new EmbedBuilder().setColor("Random").setDescription(_commands7.join(", ")).setTitle("Soundboard Commands").setFooter({text: `Total ${_commands7.length} Soundboard Commands.`});

        const _commands8 = client.commands.filter((x) => x.category && x.category === "Setup").map((x) => `\`${x.name}\``);
        const Setup = new EmbedBuilder().setColor("Random").setDescription(_commands8.join(", ")).setTitle("Setup Commands").setFooter({text: `Total ${_commands8.length} Setup Commands.`});

        const _commands9 = client.commands.filter((x) => x.category && x.category === "Utility").map((x) => `\`${x.name}\``);
        const Utility = new EmbedBuilder().setColor("Random").setDescription(_commands9.join(", ")).setTitle("Utility Commands").setFooter({text: `Total ${_commands9.length} Utility Commands.`});
        
        const msg = await message.reply({ embeds: [helpembed], components: [row, rowbut] });
        
        const filter = (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            return interaction.reply({
                content: `:x: **Only ${message.author.tag} can use this interaction!**`,
                ephemeral: true,
            });
        };
    
        const collector = message.channel.createMessageComponentCollector({
            filter,
            time: 60000,
            idle: 60000 / 2,
        });

        const pages = [ helpembed, Config, GW, Info, Mod, Developer, Fun, Soundboard, Setup, Utility ];

        let currentPage = 0;
    
        collector.on("collect", (interaction) => {
            if (!interaction.deferred) interaction.deferUpdate();

            if (interaction.customId === "prev") {
                if (currentPage === 0) currentPage = pages.length - 1;
                else currentPage--;
                msg.edit({ embeds: [pages[currentPage]] });
                
            } else if (interaction.customId === "next") {
                if (currentPage === pages.length - 1) currentPage = 0;
                else currentPage++;
                msg.edit({ embeds: [pages[currentPage]] });
                
            } else if (interaction.values[0] === 'Home') {
                currentPage = 0;
                msg.edit({ embeds: [helpembed] });
            } else if (interaction.values[0] === 'Config') {
                currentPage = 1;
                msg.edit({ embeds: [Config] });
            } else if (interaction.values[0] === 'GW') {
                currentPage = 2;
                msg.edit({ embeds: [GW] });
            } else if (interaction.values[0] === 'Info') {
                currentPage = 3;
                msg.edit({ embeds: [Info] })
            } else if (interaction.values[0] === 'Mod') {
                currentPage = 4;
                msg.edit({ embeds: [Mod] });
            } else if (interaction.values[0] === 'Developer') {
                currentPage = 5;
                msg.edit({ embeds: [Developer] });
            } else if (interaction.values[0] === 'Fun') {
                currentPage = 6;
                msg.edit({ embeds: [Fun] });
            } else if (interaction.values[0] === 'Soundboard') {
                currentPage = 7;
                msg.edit({ embeds: [Soundboard] });
            } else if (interaction.values[0] === 'Setup') {
                currentPage = 8;
                msg.edit({ embeds: [Setup] });
            } else if (interaction.values[0] === 'Utility') {
                currentPage = 9;
                msg.edit({ embeds: [Utility] });
            }
        })
    
        collector.on("end", () => {
            if (!msg) return;
            return msg.edit({ components: [row2, rowbut2] })
        })
    }  
};