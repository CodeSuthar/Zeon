const { SlashCommandBuilder } = require(`discord.js`);
const { Hangman } = require(`discord-gamecord`);
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName(`hangman`)
    .setDescription(`Play a game of hangman`),
    run: async(client, interaction) => {
 
        const Game = new Hangman({
            message: interaction,
            embed: {
                title: `Hangman`,
                color: `Random`
            },
            hangman: { hat: "🎩", head: `👨‍🦰`, shirt: `👕`, pants: `🩳`, boots: `🥾🥾`},
            timeoutTime: 60000,
            timeWords: "all",
            winMessage: `You won! The word was **{word}**`,
            loseMessage: `You lost! The word was **{word}**`,
            playerOnlyMessage: `Only {player} can use these buttons`,
        })
 
        Game.startGame();
        Game.on(`gameOver`, result => {
            return;
        });
    }
}