const { readdirSync } = require("fs");

module.exports = async (client) => {
    readdirSync("./Commands/MessageCommands/").forEach((dir) => {
        const commands = readdirSync(`./Commands/MessageCommands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let cmd = require(`../Commands/MessageCommands/${dir}/${file}`);
            if (cmd.name) {
                console.log(`[ COMMANDS ] Loading command named ${cmd.name}`);
                client.commands.set(cmd.name, cmd);
            } else {
                console.log("[ COMMANDS ]", file, `missing a cmd.name, or cmd.name is not a string.`);
                continue;
            }
            if (cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach((alias) => client.aliases.set(alias, cmd.name));
        }
    }) 
};