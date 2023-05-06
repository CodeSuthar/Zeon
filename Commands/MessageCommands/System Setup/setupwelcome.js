const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const db = require("../../../Database/welcome.js");

module.exports = {
    name: "setupwelcome",
    category: "Setup",
    aliases: ["wel", "wlc", "wlcm", "welc", "setup-welcome"],
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
                label: "Enable Welcome System",
                value: "enable",
                emoji: "1️⃣"
            },
            {
                label: "Disable Welcome System",
                value: "disable",
                emoji: "2️⃣"
            },
            {
                label: "Configure Welcome Channel",
                value: "channel",
                emoji: "3️⃣"
            },
            {
                label: "Configure Welcome Message",
                value: "message",
                emoji: "4️⃣"
            },
            {
                label: "Enable Or Disable Welcome Embed",
                value: "embed",
                emoji: "5️⃣"
            },
            {
                label: "Enable Or Disable Welcome Button",
                value: "button",
                emoji: "6️⃣"
            },
            {
                label: "Cancel",
                value: "cancel",
                emoji: "7️⃣"
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
                        .setDescription(`Give Me A Channel To Get Started With Welcome!`)
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
                                Embed: false,
                                Button: false,
                                Description: "/membermention/ joined /servername/. Now We Have /servermc/ Member's"
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
                        .setDescription(`Welcome Is Setupped In <#${channel.id}>`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();   
                    } else {
                        const e = new EmbedBuilder()
                        .setDescription(`Hey Dumbo, You Already Have Setupped Welcome System!`)
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
                        .setDescription(`You Don't Have Setupped Welcome System! Then How Can I Disable It?, Dumbo!`)
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
                        .setDescription(`Welcome Is Setupped In <#${channel.id}>`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed] });
                    } else {
                        const embed = new EmbedBuilder()
                        .setDescription(`You Don't Have Setupped Welcome System! Then How Can I Disable It?, Dumbo!`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();   
                    }
                }
                
                if (decision === "message") {
                    if (!data) {
                        const embed = new EmbedBuilder()
                        .setDescription(`You Need To Setup The **Welcoming Channel** First`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();
                    } else {
                        const emb = new EmbedBuilder()
                        .setTitle(`📘 Guide Provided To You!`)
                        .setDescription(`Why Looking Here? Just Type Your Message With Attributes, We Will Do The Rest!`)
                        .setColor("Random")
                        .addFields(
                            { name: "Attributes", value: `\`\`\`/membermention/ - Mention The Member Who Joined\n**/servername/** - Server Name\n/servermc/ - Server Member Count\`\`\``, inline: true },
                        )

                        msg.edit({ embeds: [emb], components: [] });

                        let wlmsg;

                        await interaction.channel.awaitMessages({
                            filter: (interaction) => interaction.author.id === message.author.id,
                            max: 1,
                            time: 90000,
                            errors: ["time"]
                        }).then((collected) => {
                            const memberreply = collected.first()

                            wlmsg = memberreply.content;
                        })

                        data.Description = wlmsg;
                        await data.save();
                        const embed = new EmbedBuilder()
                        .setDescription(`Welcome Message Is Setupped! \`<3\``)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();
                    }
                }

                if (decision === "embed") {
                    if (!data) {
                        const embed = new EmbedBuilder()
                        .setDescription(`You Need To Setup The **Welcoming Channel** First`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();
                    } else {
                        if (data.Embed === false) {
                            data.Embed = true;
                            await data.save();
                            const embed = new EmbedBuilder()
                            .setDescription(`Embed For Welcome Message Is Enabled Now!`)
                            .setColor("Random")
                            msg.edit({ embeds: [embed], components: [] });
                            return collector.stop();
                        } else {
                            data.Embed = false;
                            await data.save();
                            const embed = new EmbedBuilder()
                            .setDescription(`Embed For Welcome Message Is Disabled Now!`)
                            .setColor("Random")
                            msg.edit({ embeds: [embed], components: [] });
                            return collector.stop();
                        }
                    }
                }

                if (decision === "button") {
                    if (!data) {
                        const embed = new EmbedBuilder()
                        .setDescription(`You Need To Setup The **Welcoming Channel** First`)
                        .setColor("Random")
                        msg.edit({ embeds: [embed], components: [] });
                        return collector.stop();
                    } else {
                        if (data.Button === false) {
                            data.Button = true;
                            await data.save()
                            const embed = new EmbedBuilder()
                            .setDescription(`Button For Welcome Message Is Enabled Now!`)
                            .setColor("Random")
                            msg.edit({ embeds: [embed], components: [] });
                            return collector.stop();
                        } else {
                            data.Button = false;
                            await data.save()
                            const embed = new EmbedBuilder()
                            .setDescription(`Button For Welcome Message Is Disabled Now!`)
                            .setColor("Random")
                            msg.edit({ embeds: [embed], components: [] });
                            return collector.stop();
                        }
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

            collector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    const embed = new EmbedBuilder()
                    .setDescription(`You Took Too Long To Respond!`)
                    .setColor("Random")
                    msg.edit({ embeds: [embed], components: [] });
                }
            });
        })
    }
}