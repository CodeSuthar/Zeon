const { EmbedBuilder } = require("discord.js");
const ticketSchema = require("../../Database/ticketSchema");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) return;
        if (interaction.isStringSelectMenu()) return;
        if (interaction.isModalSubmit()) return;
        if (!["ticketclosebutton"].includes(interaction.customId)) return;

        if (interaction.isButton()) {
            if (interaction.customId === "ticketclosebutton") {
                await interaction.deferUpdate();

                const channel = interaction.channel;
                const member = interaction.member;

                const dmEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Your ticket has been closed")
                    .setDescription("Thanks for contacting us! If you need anything else just feel free to open up another ticket!")
                    .setTimestamp()

                await channel.delete();
                return await member.send({ embeds: [dmEmbed] }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
};