const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "giveawayEnded",
    run: async (client, giveaway, winners) => {
        for (const winner of winners) {
            const EMBED = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Congratulation. Giveaway Won!")
            .setDescription(`Congratulations! ${winner}, you won the giveaway prize __**${giveaway.prize}**__!`)
            .setFooter({ text: `Server Id: ${giveaway.guildId}` })

            winner.send({
                contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway.`,
                embeds: [
                    EMBED
                ]
            }).catch(() => {});
        }
        return console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
    }
};