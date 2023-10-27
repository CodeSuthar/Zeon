const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue, QueryType, lyricsExtractor } = require("discord-player");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get The Lyrics Of The Current Track Or The Track You Want!")
    .addStringOption(option => option.setName("song").setDescription("The Song Name To Get The Lyrics Of")),    
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const Player = await useMainPlayer();

        const Queue = await useQueue(interaction.guildId);

        const query = interaction.options.getString("song");

        if (!query) {
            if (!interaction.member.voice.channelId) {
                const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | You Need To Be Connected To A Voice Channel To Use This Command!`)
                .setColor("Random")

                return interaction.editReply({ embeds: [embed] })
            }

            if (!Queue) {
                const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | I'm Not Connected To Any Voice Channel To Find Lyrics In This Server!`)
                .setColor("Random")

                return interaction.editReply({ embeds: [embed] })
            }

            if (!Queue.currentTrack) {
                const embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | There's No Current Track Playing To Find Lyrics!`)
                .setColor("Random")

                return interaction.editReply({ embeds: [embed] })
            }

            const geniusSearchQuery = await getGeniusSearchQuery(query, Queue);

            const [playerSearchResult, geniusLyricsResult] = await Promise.all([
                await getPlayerSearchResult(Player, geniusSearchQuery),
                await getGeniusLyricsResult(geniusSearchQuery)
            ]);

            const finalLyricsData = validateGeniusLyricsResult(geniusLyricsResult, playerSearchResult, Queue);

            if (!finalLyricsData) {
                return await sendNoLyricsFoundEmbed(client, interaction, geniusSearchQuery)
            }

            if (finalLyricsData.lyrics.length > 3800) {
                return await sendMultipleLyricsMessages(client, interaction, finalLyricsData)
            }

            return await sendLyricsEmbed(client, interaction, finalLyricsData)
        }
    }
};

function getGeniusSearchQuery(query, queue) {
    const geniusSearchQuery = query ?? queue.currentTrack.title.slice(0, 50) + " " + queue.currentTrack.author.split(", ")[0]
    console.log(`[GENIUS - Lyrics Search System] Search query: ${geniusSearchQuery}`)
    return geniusSearchQuery
}

async function getPlayerSearchResult(Player, query) {
    if (!query) return null
    console.log(`[GENIUS - Lyrics Search System] Query input provided, using query '${query}' for player.search().`);

    const searchResults = await Player.search(query, {
        searchEngine: QueryType.SPOTIFY_SEARCH
    }).catch(() => null);

    if (!searchResults || searchResults.tracks.length === 0) {
        console.log(`[GENIUS - Lyrics Search System] No search results using player.search() found.`);
        return null
    }

    return searchResults.tracks[0];
}

async function getGeniusLyricsResult(geniusSearchQuery) {
    const genius = lyricsExtractor(`-RBRkGameLB-bmBXuboHBKkhQp3TCXJw8VBxJVpC5RSlM3jMHM0C8n_VNlwa_k5Y`)
    let geniusLyricsResult = await genius.search(geniusSearchQuery).catch(() => null)

    if (!geniusLyricsResult && geniusSearchQuery.length > 20) {
        console.log(`[GENIUS - Lyrics Search System] No lyrics found, trying again with shorter query.`)
        geniusLyricsResult = await retryGeniusLyricsSearchSorterQuery(
            geniusSearchQuery
        )
    }

    return geniusLyricsResult;
}

async function retryGeniusLyricsSearchSorterQuery(geniusSearchQuery) {
    if (geniusSearchQuery.length < 10) {
        return null
    }

    const retryQuery = geniusSearchQuery.slice(0, geniusSearchQuery.length - 10);

    const retryLyricsResult = await getGeniusLyricsResult(
        retryQuery
    )

    if (!retryLyricsResult) {
        return await retryGeniusLyricsSearchSorterQuery(retryQuery)
    }

    return retryLyricsResult
}

function validateGeniusLyricsResult(geniusLyricsResult, playerSearchResult, queue) {
    if (geniusLyricsResult && !doesArtistNameMatch(playerSearchResult, geniusLyricsResult, queue)) {
        console.log(`[GENIUS - Lyrics Search System] Found Genius lyrics but artist name did not match from player.search() result.`)
        geniusLyricsResult = null
    }

    if (!geniusLyricsResult || geniusLyricsResult.lyrics.length === 0) {
        console.log(`[GENIUS - Lyrics Search System] No lyrics found.`)
        geniusLyricsResult = null
    }

    return geniusLyricsResult
}

function doesArtistNameMatch(playerSearchResult, geniusLyricsResult, queue) {
    const playerAuthorLower = playerSearchResult?.author.toLowerCase() ??queue.currentTrack.author.toLowerCase()
    const geniusArtistNameLower = geniusLyricsResult.artist.name.toLowerCase()

    return (
        playerAuthorLower.includes(geniusArtistNameLower) ||
        geniusArtistNameLower.includes(playerAuthorLower) ||
        geniusArtistNameLower.includes(playerAuthorLower.split(", ")[0])
    )
}


async function sendNoLyricsFoundEmbed(client, interaction, geniusSearchQuery) {
    console.log(`[GENIUS - Lyrics Search System] No lyrics found, responding with no lyrics found embed.`)

    const embed = new EmbedBuilder()
    .setDescription(`${client.emoji.wrong} | No Lyrics Found For **${geniusSearchQuery}**!`)

    return await interaction.editReply({
      embeds: [embed]
    })
}

async function sendMultipleLyricsMessages(client, interaction, geniusLyricsResult) {
    console.log(`[GENIUS - Lyrics Search System] Lyrics found, responding with multiple info embeds.`)

    const messageCount = Math.ceil(geniusLyricsResult.lyrics.length / 3800)

    const embedList = []

    embedList.push(
        new EmbedBuilder()
        .setDescription(`**${client.emoji.queue} Showing lyrics**\n` + `**Track: [${geniusLyricsResult.title}](${geniusLyricsResult.url})**\n` + `**Artist: [${geniusLyricsResult.artist.name}](${geniusLyricsResult.artist.url})**\n\n`)
        .setColor(`Random`)
    )

    for (let i = 0; i < messageCount; i++) {
        console.log(`[GENIUS - Lyrics Search System] Adding message ${i + 1} of ${messageCount} to embed list.`)

        const message = geniusLyricsResult.lyrics.slice(i * 3800, (i + 1) * 3800);

        embedList.push(
            new EmbedBuilder()
            .setDescription(`\`\`\`fix\n${message}\`\`\``)
            .setColor(`Random`)
        )
    }

    console.log(`[GENIUS - Lyrics Search System] Lyrics found, responding with multiple info embeds.`)
    return await interaction.editReply({
        embeds: embedList
    })
}

async function sendLyricsEmbed(client, interaction, geniusLyricsResult) {
    console.log(`[GENIUS - Lyrics Search System] Lyrics found, responding with info embed.`)
    return await interaction.editReply({
        embeds: [
            new EmbedBuilder()
            .setDescription(
                `**${client.emoji.wrong} Showing lyrics**\n` + `**Track: [${geniusLyricsResult.title}](${geniusLyricsResult.url})**\n` + `**Artist: [${geniusLyricsResult.artist.name}](${geniusLyricsResult.artist.url})**\n\n` + `\`\`\`fix\n${geniusLyricsResult.lyrics}\`\`\``
            )
            .setColor(`Random`)
        ]
    })
}