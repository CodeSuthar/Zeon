const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Bot, Dashboard } = require(`../../config.js`)

function GetChoicesCommand() {
    const rest = new REST({ version: '9' }).setToken(Bot.Token);

    let sls;

    let choices = [];

    (async () => {
        try {
                console.log('[ Slash CMD ] Started fetching application (/) commands.');
    
                sls = await rest.get(
                    Routes.applicationCommands(Dashboard.Information.ClientID)
                );

                sls.forEach((data) => {
                    choices.push(data.name)
                });
        } catch (error) {
            console.error(error);
        }
    })();

    return choices
}

function convertTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (duration >= 86400000) "◉ LIVE";
    if (duration >= 3600000) return hours + ":" + minutes + ":" + seconds;
    if (duration < 3600000) return minutes + ":" + seconds;
}

function CapitalizeText(text) {
    const capitalizedSentence = text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return capitalizedSentence
}

module.exports = { CapitalizeText, GetChoicesCommand, convertTime }