const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { stripIndent } = require('common-tags');

module.exports = {
    SlashData: new SlashCommandBuilder()
        .setName('pokedex')
        .setDescription('Search for a Pokemon')
        .addStringOption((option) => option.setName('pokemon').setDescription('The Pokemon to search for').setRequired(true)),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options } = interaction;
        const pokemon = options.getString('pokemon');

        const response = await pokedex(pokemon);

        await interaction.editReply(response);
    },
};

async function pokedex(pokemon) {
    try {
        const response = await axios.get(`https://pokeapi.glitch.me/v1/pokemon/${pokemon}`);
        const json = response.data;

        if (response.status === 404) return '```The given Pokemon is not found```';
        if (!json.success) return MESSAGES.API_ERROR;

        const embed = new EmbedBuilder()
            .setTitle(`Pokédex - ${json.name}`)
            .setColor('RANDOM')
            .setThumbnail(json.sprite)
            .setDescription(
                stripIndent`
          ♢ **ID**: ${json.number}
          ♢ **Name**: ${json.name}
          ♢ **Species**: ${json.species}
          ♢ **Type(s)**: ${json.types}
          ♢ **Abilities(normal)**: ${json.abilities.normal}
          ♢ **Abilities(hidden)**: ${json.abilities.hidden}
          ♢ **Egg group(s)**: ${json.eggGroups}
          ♢ **Gender**: ${json.gender}
          ♢ **Height**: ${json.height} foot tall
          ♢ **Weight**: ${json.weight}
          ♢ **Current Evolution Stage**: ${json.family.evolutionStage}
          ♢ **Evolution Line**: ${json.family.evolutionLine}
          ♢ **Is Starter?**: ${json.starter}
          ♢ **Is Legendary?**: ${json.legendary}
          ♢ **Is Mythical?**: ${json.mythical}
          ♢ **Is Generation?**: ${json.gen}
        `
            )
            .setFooter({ text: json.description });

        return { embeds: [embed] };
    } catch (e) {
        return '```The given Pokemon is not found```';
    }
}