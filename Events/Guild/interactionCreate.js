const { InteractionType, EmbedBuilder, Collection, ButtonBuilder } = require("discord.js");
const Topgg = require("@top-gg/sdk");
const pdata = require("../../Database/premium.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        const PGuild = await pdata.findOne({ _id: interaction.guild.id });

        if(interaction.type === InteractionType.ApplicationCommand) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;

            if (SlashCommands) {
                try {
                    const data = await client.db.get(`botcommandchannel_${interaction.guild.id}`);

                    if (data) {
                        const data2 = await client.db.get(`botcommandchannel_channel_${interaction.guild.id}`);
    
                        if (interaction.channel.id !== data2) {
                            const embedpro = new EmbedBuilder()
                            .setDescription(`${client.emoji.wrong} | This guild has configured the Bot System to listen Commands only in <#${data2}> channel. So, To use the bot run commands in <#${data2}> channel.`)
                            .setColor("Random")
    
                            if (!interaction.replied) {
                                interaction.reply({ embeds: [embedpro] });
                            } else {
                                interaction.editReply({ embeds: [embedpro] });
                            }
                        }
                    }

                    const db = await client.db.get(`blacklist_${interaction.user.id}`);

                    if (db) {
                        if (interaction.replied) {
                            return interaction.editReply({ content: `${client.emoji.wrong} | You Are Blacklisted From Using This Bot` })
                        } else {
                            return interaction.reply({ content: `${client.emoji.wrong} | You Are Blacklisted From Using This Bot` })
                        }
                    }

                    if (SlashCommands.premiumReq) {
                        if (!PGuild) {
                            if (interaction.replied) {
                                return await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`The command is premium only, you can purchase premium to override all command restrictions, including vote request command. To buy, contact Rtxeon#4726`)] }).catch(() => { });
                            } else {
                                return await interaction.reply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`The command is premium only, you can purchase premium to override all command restrictions, including vote request command. To buy, contact Rtxeon#4726`)] }).catch(() => { });
                            }
                        }
                    }

                    if (SlashCommands.voteReq) {
                        if (!PGuild) {
                            const topgg = new Topgg.Api(client.config.BotList.TopGG.APIToken);
                            let voted = await topgg.hasVoted(interaction.user.id);
                            if (!voted && !client.DeveloperId.includes(interaction.user.id)) {
                                if (interaction.replied) {
                                    return await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must vote me on [Top.gg](${client.config.BotList.TopGG.LinkToVote}) to use this command, or you can purchase premium to override all command restrictions. To buy, contact \`Rtxeon#4726\``)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Vote").setStyle(5).setURL(client.config.BotList.TopGG.LinkToVote))] }).catch(() => { });
                                } else {
                                    return await interaction.reply({ embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must vote me on [Top.gg](${client.config.BotList.TopGG.LinkToVote}) to use this command, or you can purchase premium to override all command restrictions.  To buy, contact \`Rtxeon#4726\``)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Vote").setStyle(5).setURL(client.config.BotList.TopGG.LinkToVote))] }).catch(() => { });
                                }
                            }
                        }
                    };

                    if (SlashCommands.developer && client.DeveloperId.includes(interaction.user.id)) {
                        if (interaction.replied) {
                           return  interaction.editReply({ content: `Im, Not A Fool Bot, Only Owner Can Use This Commands` })
                        } else {
                            return interaction.reply({ content: `Im, Not A Fool Bot, Only Owner Can Use This Commands` })
                        }
                    }
                    await SlashCommands.run(client, interaction);
                } catch (e) {
                    console.log(e);
                    if (interaction.replied) {
                        const embed = new EmbedBuilder()
                        .setDescription("There Was An Error Executing The Command, Sorry For The Inconvenience \`<3\`");
                        return interaction.editReply({ embeds: [embed], ephemeral: true }).catch(() => {});
                    } else {
                        const embed = new EmbedBuilder()
                        .setDescription("There Was An Error Executing The Command, Sorry For The Inconvenience \`<3\`");
                        return interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
                    }
                }
            }
        } else return;
    }
};