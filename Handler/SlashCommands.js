const { readdirSync } = require("fs");
const { ApplicationCommandType, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

module.exports = async (client) => {
    const SlashData = [];
    readdirSync("./Commands/SlashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./Commands/SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
        for (const file of slashCommandFile) {
            const slashCommand = require(`../Commands/SlashCommands/${dir}/${file}`);

            if (!slashCommand.SlashData.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if (!slashCommand.SlashData.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.SlashData.name, slashCommand);
            console.log(`[ Slash CMD ] Client SlashCommands Command (/) Loaded: ${slashCommand.SlashData.name}`);

            SlashData.push(slashCommand.SlashData);
        }
    });
    const rest = new REST({ version: "10" }).setToken(client.config.Bot.Token);
    client.on("ready", async () => {
        (async () => {
            try {
                console.log(`[ Slash CMD ] Started refreshing application (/) commands.`);
                await rest.put(Routes.applicationCommands(client.user.id), {
                   body: SlashData,
                });
                console.log(`[ Slash CMD ] Successfully reloaded application (/) commands.`);
            } catch (error) {
                console.error(`[ Slash CMD ] SlashError: ${error}`);
            }
        })();
    })
};