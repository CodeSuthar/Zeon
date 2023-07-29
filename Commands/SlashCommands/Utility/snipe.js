const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipes the most recent deleted message!'),
    run: async(client, interaction) => {
        const snipe = client.snipes.get(interaction.channel.id);

        if (!snipe) {
            if (!interaction.replied) await interaction.deferReply({ ephemeral: true })

            const emb = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | Nothing to snipe in <#${interaction.channel.id}>`)
            .setColor('Random')

            await interaction.editReply({ embeds: [emb] });
        } else {
            if (!interaction.replied) await interaction.deferReply()

            const embed = new EmbedBuilder()
            .setColor('Random')
            .setImage(snipe.image)
            .setDescription(`${client.emoji.litter} Message sent by <@${snipe.author}> deleted in ⁠<#${interaction.channel.id}>\n__**Content**__:\n${snipe.content}`)
            .setFooter({ text: `Deleted ${Math.floor((Date.now() - snipe.timestamp) / 1000)} seconds ago` })

            await interaction.editReply({ embeds: [embed] });
        }
    }
}