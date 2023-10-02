const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
const fetch = require("node-fetch");
const { stripIndent } = require("common-tags");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName(`pokedex`)
    .setDescription(`Search for a pokemon`)
    .addStringOption(option => option.setName(`pokemon`).setDescription(`The pokemon to search for`).setRequired(true)),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options } = interaction;
        const pokemon = options.getString(`pokemon`);

        const response = await pokedex(pokemon);

        await interaction.editReply(response);
    }
};

async function pokedex(pokemon) {
    const response = await getJson(`https://pokeapi.glitch.me/v1/pokemon/${pokemon}`);
    if (response.status === 404) return "```The given pokemon is not found```";
    if (!response.success) return MESSAGES.API_ERROR;
  
    const json = response.data[0];
  
    const embed = new EmbedBuilder()
      .setTitle(`Pokédex - ${json.name}`)
      .setColor("Random")
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
}

async function getJson(url, options) {
    try {
      // with auth
      const response = options ? await fetch(url, options) : await fetch(url);
      const json = await response.json();
      return {
        success: response.status === 200 ? true : false,
        status: response.status,
        data: json,
      };
    } catch (ex) {
      debug(`Url: ${url}`);
      error(`getJson`, ex);
      return {
        success: false,
      };
    }
  }