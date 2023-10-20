module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isAutocomplete()) {
            const slashCommand = client.slashCommands.get(interaction.commandName);

            if (!slashCommand) return;

            try {
                await slashCommand.autocomplete(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }
}