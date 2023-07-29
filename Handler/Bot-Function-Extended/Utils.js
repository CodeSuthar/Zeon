const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Bot, Dashboard } = require(`../../config.js`)

function ImageGenerationGetChoices() {
    const imagegenchoices = [
        {
            name: 'Stable Diffusion (Default)',
            value: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
        },
        {
            name: 'Openjourney (Midjourney style)',
            value: 'https://api-inference.huggingface.co/models/prompthero/openjourney',
        },
        {
            name: 'Waifu Diffusion',
            value: 'https://api-inference.huggingface.co/models/hakurei/waifu-diffusion',
        },
    ];

    return imagegenchoices;
}

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

function CapitalizeText(text) {
    const capitalizedSentence = text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return capitalizedSentence
}

module.exports = { ImageGenerationGetChoices, CapitalizeText, GetChoicesCommand }