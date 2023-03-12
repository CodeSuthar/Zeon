const { InteractionType, EmbedBuilder, Collection } = require("discord.js");
const dbprefix = require("../../Database/prefix.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        let prefix = client.runfix
        const ress =  await dbprefix.findOne({ Guild: interaction.guildId })
        if (ress && ress.Prefix) prefix = ress.Prefix;
        if(interaction.type === InteractionType.ApplicationCommand) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;

            if (SlashCommands) {
                try {
                    const db = await client.db.get(`blacklist_${interaction.user.id}`);

                    if (db) {
                        if (interaction.replied) {
                            return interaction.editReply({ content: `${client.emoji.wrong} | You Are Blacklisted From Using This Bot` })
                        } else {
                            return interaction.reply({ content: `${client.emoji.wrong} | You Are Blacklisted From Using This Bot` })
                        }
                    }

                    if (SlashCommands.developer && client.DeveloperId.includes(interaction.user.id)) {
                        if (interaction.replied) {
                           return  interaction.editReply({ content: `Im, Not A Fool Bot, Only Owner Can Use This Commands` })
                        } else {
                            return interaction.reply({ content: `Im, Not A Fool Bot, Only Owner Can Use This Commands` })
                        }
                    }
                    await SlashCommands.run(client, interaction, prefix);
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