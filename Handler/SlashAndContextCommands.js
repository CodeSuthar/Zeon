const { readdirSync } = require("fs");
const { ApplicationCommandType, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

module.exports = async (client) => {
    const SlashAndContextData = [];
    readdirSync("./Commands/SlashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./Commands/SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
        for (const file of slashCommandFile) {
            const slashCommand = require(`../Commands/SlashCommands/${dir}/${file}`);

            if (!slashCommand.SlashData.name) return console.error(`slashCommandNameError: ${file.split(".")[0]} application command name is required.`);

            if (!slashCommand.SlashData.description) return console.error(`slashCommandDescriptionError: ${file.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.SlashData.name, slashCommand);
            console.log(`[ Slash CMD ] Client SlashCommands Command (/) Loaded: ${slashCommand.SlashData.name}`);

            SlashAndContextData.push(slashCommand.SlashData);
        }
    });

    readdirSync("./Commands/ContextCommands/").forEach((dir) => {
        const contextCommandFile = readdirSync(`./Commands/ContextCommands/${dir}/`).filter((files) => files.endsWith(".js"));
        for (const file of contextCommandFile) {
            const contextCommand = require(`../Commands/ContextCommands/${dir}/${file}`);

            if (!contextCommand.ContextData.name) return console.error(`contextCommandNameError: ${file.split(".")[0]} application command name is required.`);

            client.slashCommands.set(contextCommand.ContextData.name, contextCommand);
            console.log(`[ Context CMD ] Client ContextCommands Command (/) Loaded: ${contextCommand.ContextData.name}`);

            SlashAndContextData.push(contextCommand.ContextData);
        }
    });
  
    const rest = new REST({ version: "10" }).setToken(client.config.Bot.Token);
    client.on("ready", async () => {
        (async () => {
            try {
                console.log(`[ Slash And Context CMD ] Started refreshing application (/) commands.`);
                await rest.put(Routes.applicationCommands(client.user.id), {
                   body: SlashAndContextData,
                });
                console.log(`[ Slash And Context CMD ] Successfully reloaded application (/) commands.`);
            } catch (error) {
                console.error(`[ Slash And Context CMD ] SlashOrContextError: ${error}`);
            }
        })();
    })
};