const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Setup the Automod")
    .addSubcommand(command => command
        .setName("flagged-words")
        .setDescription("block profanity, specific content, and slurs")
    )
    .addSubcommand(command => command
        .setName("spam-messages")
        .setDescription("anti spam")
    )
    .addSubcommand(command => command
        .setName("mention-spam")
        .setDescription("anti spam")
        .addIntegerOption(option => option
            .setName("number")
            .setDescription("The Number of max Mentions")
            .setRequired(true))
    )
    .addSubcommand(command => command
        .setName("keyword")
        .setDescription("Block a given Keyword in the Server")
        .addStringOption(option => option
            .setName("word")
            .setDescription("The word")
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { guild, options } = interaction;
        const sub = options.getSubcommand();
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Administrator permission to use this command!` });
 
        switch (sub) {
            case "flagged-words":
 
            await interaction.editReply({ content: `Loading your Automod rule....`});
 
            const rule = await guild.autoModerationRules.create({
                name: `Block profinity, sexual content, and slurs by Zeon Bot`,
                creatorId: '969558840926437406',
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata: 
                    {
                        presets: [1, 2, 3]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'This message was prevented by Zeon Bot'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return;
                }, 2000)
            })
 
            setTimeout(async () => {
                if (!rule) return;
 
                const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Your automod rule has been created`)
 
                await interaction.editReply({
                    content: ``,
                    embeds: [embed]
                })
            }, 3000)
 
            break;
 
            case 'keyword':
 
            await interaction.editReply({ content: `Loading your Automod rule....`});
            const word = options.getString("word");
 
            const rule2 = await guild.autoModerationRules.create({
                name: `Prevent the word ${word} by Zeon Bot`,
                creatorId: '969558840926437406',
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: 
                    {
                        keywordFilter: [`${word}`]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'This message was prevented by Zeon Bot'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return;
                }, 2000)
            })
 
            setTimeout(async () => {
                if (!rule2) return;
 
                const embed2 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Your automod rule has been created. Messages with **${word}** will be deleted`)
 
                await interaction.editReply({
                    content: ``,
                    embeds: [embed2]
                })
            }, 3000)
 
            break;
 
            case 'spam-messages':
 
            await interaction.editReply({ content: `Loading your Automod rule....`});
 
 
            const rule3 = await guild.autoModerationRules.create({
                name: `Prevent Spam Messages by Zeon Bot`,
                creatorId: '969558840926437406',
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata: 
                    {
                        mentionTotalLimit: 3
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'This message was prevented by Zeon Bot'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return;
                }, 2000)
            })
 
            setTimeout(async () => {
                if (!rule3) return;
 
                const embed3 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Your automod rule has been created`)
 
                await interaction.editReply({
                    content: ``,
                    embeds: [embed3]
                })
            }, 3000)
 
            break;
 
            case 'mention-spam': 
            await interaction.editReply({ content: `Loading your Automod rule....`});
            const number =  options.getInteger("number")
 
            const rule4 = await guild.autoModerationRules.create({
                name: `Prevent Spam Messages by Zeon Bot`,
                creatorId: '969558840926437406',
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata: 
                    {
                        mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'This message was prevented by Zeon Bot'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return;
                }, 2000)
            })
 
            setTimeout(async () => {
                if (!rule4) return;
 
                const embed4 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Your automod rule has been created`)
 
                await interaction.editReply({
                    content: ``,
                    embeds: [embed4]
                })
            }, 3000)
 
            break;
 
        }
    }
}