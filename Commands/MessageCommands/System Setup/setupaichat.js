const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const db = require("../../../Database/aichat.js");

module.exports = {
    name: "setupaichat",
    category: "Setup",
    aliases: ["aichat", "setup-aichat"],
    description: "Let You Customise Welcome System",
    usage: "greet || embed || channel",
    cooldown: 5,
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`MANAGE_GUILD Or ADMINISTRATOR\` permissions to execute this command!`);

        const data = await db.findOne({ Guild: message.guildId });

        const embed = new EmbedBuilder()
        .setDescription("For What You Were Here!")
        .setColor("Random")

        const menu = new SelectMenuBuilder()
        .setCustomId('menu')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`Selct Your Operation For What You Were Here!`)
        .addOptions([
            {
                label: "Enable AIChat System",
                value: "enable",
                emoji: "1️⃣"
            },
            {
                label: "Disable AIChat System",
                value: "disable",
                emoji: "2️⃣"
            },
            {
                label: "Configure AIChat Channel",
                value: "channel",
                emoji: "3️⃣"
            },
            {
                label: "Cancel",
                value: "cancel",
                emoji: "4️⃣"
            },
        ])

        const row = new ActionRowBuilder()
        .addComponents(menu)
        
        message.reply({
            embeds: [embed],
            components: [row]
        }).then((msg) => {

            const collector = msg.channel.createMessageComponentCollector({
                filter: (interaction) => {
                    if (interaction.user.id === message.author.id) return true;
                    else {
                        interaction.reply({
                            content: `❌ **Only ${message.author.tag} can use this interaction!**`,
                            ephemeral: true,
                        })
                    }
                },
                max: 1,
                time: 60000,
                idle: 60000/2
            });

            collector.on("collect", async (interaction) => {
                interaction.deferUpdate();
                const decision = interaction.values[0];

                if (decision === "enable") {
                    if (!data) {
                        const wait = new EmbedBuilder()
                        .setDescription(`Give Me A Channel To Get Started With AIChat!`)
                        .setColor("Random")

                        msg.edit({ embeds: [wait], components: [] })
                        let newData;
                        let channel;

                        await interaction.channel.awaitMessages({
                            filter: (interaction) => interaction.author.id === message.author.id,
                            max: 1,
                            time: 90000,
                            errors: ["time"]
                        }).then((collected) => {
                            const memberreply = collected.first()
                            channel = memberreply.mentions.channels.first();

                            if (!channel) {
                                return;
                            }

                            newData = new db({
                                Guild: message.guild.id,
                                Channel: channel.id,
                            });
                        });

                        try {
                            await newData.save()
                        } catch (e) {
                            const err = new EmbedBuilder()
                            .setDescription(`❌ **You Didn't Ping A Channel!**`)
                            .setColor("RED")

                            msg.edit({ embeds: [err], components: [] });
                            return;
                        }
                        const embed = new EmbedBuilder()
                        .setDescription(`AIChat Is Setupped In <#${channel.id}>`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();   
                    } else {
                        const e = new EmbedBuilder()
                        .setDescription(`Hey Dumbo, You Already Have Enabled Welcome System!`)
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();
                    }
                }

                if (decision === "disable") {
                    if (data) {
                        const e = new EmbedBuilder()
                        .setDescription(`Sorry, For The Inconvenience, Bye Bye! \`<3\``)
                        msg.edit({ embeds: [embed], components: [] });
                        await data.delete();
                        return collector.stop();
                    } else {
                        const embed = new EmbedBuilder()
                        .setDescription(`You Don't Have Setupped AIChat System! Then How Can I Disable It?, Dumbo!`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();   
                    }
                }

                if (decision === "channel") {
                    if (data) {
                        const wait = new EmbedBuilder()
                        .setDescription(`Give Me A Channel To Get Started With Welcome!`)
                        .setColor("Random")

                        msg.edit({ embeds: [wait], components: [] })
                        let channel;

                        await interaction.channel.awaitMessages({
                            filter: (interaction) => interaction.author.id === message.author.id,
                            max: 1,
                            time: 90000,
                            errors: ["time"]
                        }).then((collected) => {
                            const memberreply = collected.first()
                            channel = memberreply.mentions.channels.first();

                            if (!channel) {
                                return;
                            }
                        })

                        try {
                            data.Channel = channel.id;
                            data.save();
                        } catch (e) {
                            const err = new EmbedBuilder()
                            .setDescription(`❌ **You Didn't Ping A Channel!**`)
                            .setColor("RED")

                            msg.edit({ embeds: [err], components: [] });
                            return;
                        }
                        const embed = new EmbedBuilder()
                        .setDescription(`AIChat Is Setupped In <#${channel.id}>`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed] });
                    } else {
                        const embed = new EmbedBuilder()
                        .setDescription(`You Don't Have Setupped AIChat System! Then How Can I Configure The AI Chat Channel?, Dumbo!`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();   
                    }
                }
                
                if (decision === "cancel") {
                    const end = new EmbedBuilder()
                    .setTitle(`Cancelled The Process On Your Request!`)
                    .setColor("Random")
                    msg.edit({ embeds: [end], components: [] });
                    return collector.stop();
                }  
            })
        })
    }
}