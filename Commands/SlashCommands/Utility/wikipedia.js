const wiki = require('wikijs').default();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('wikipedia')
    .setDescription('Gives you an article in shortform from wikipedia.')
    .addSubcommand(subcommand => subcommand
        .setName('search')
        .setDescription('search something on wikipedia.')
        .addStringOption(option => option
            .setName('query')
            .setDescription('the query you want to search.')
            .setRequired(true)
        )
    ),
    run: async(client, interaction, args) => {
        if (!interaction.replied) await interaction.deferReply();
 
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "search") {
            const query = interaction.options.getString('query');
 
            const search = await wiki.search(query);
            if (!search.results.length) return await interaction.editReply({ content: `Wikipedia doesn't seem to know what your searching for....`});
 
            const result = await wiki.page(search.results[0]);
 
            const summary = await result.summary();
            if (summary.length > 8192) return await interaction.reply({ content: `${summary.slice(0, 2048)}`, ephemeral: true});
            else {
                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`Wiki Search: ${result.raw.title}`)
                .setDescription(`\`\`\`${summary.slice(0, 2048)}\`\`\``)
 
                await interaction.editReply({ embeds: [embed] });
            }
        }
    }
}