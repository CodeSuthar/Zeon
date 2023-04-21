const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('tic-tac-toe')
    .setDescription("Help's you to play a game of Tic-Tac-Toe.")
    .addUserOption(option => option
        .setName('opponent')
        .setDescription('Specified user that will be your opponent.')
        .setRequired(true)
    ),
    run: async (client, interaction) => {
 
        const enemy = interaction.options.getUser('opponent');
        if (interaction.user.id === enemy.id) return await interaction.reply({ content: `You **cannot** play with yourself, silly goose..`, ephemeral: true});
        if (enemy.bot) return await interaction.reply({ content: `You **cannot** play with a bot, silly goose..`, ephemeral: true});
 
        const game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('opponent'),
            embed: {
                title: '> Tic Tac Toe',
                color: 'Random',
                statusTitle: '• Status',
                overTitle: '• Game Over', 
            },
            emojis: {
                xButton: '❌',
                oButton: '🔵',
                blankButton: '➖'
            },
            mentionUser: true,
            timeoutTime: 120000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '> **{player}**, it is your turn!.',
            winMessage: '> **{player}** won the TicTacToe Game!',
            tieMessage: '> The game turned out to be a tie!',
            timeoutMessage: '> The game went unfinished! no one won the game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
        });
 
        try {
            await game.startGame();
        } catch (e) {
            console.log(e);
            await interaction.reply('There was an error starting the game!');
        }
 
        game.on('gameOver', result => {
            return;
        });
    }
};