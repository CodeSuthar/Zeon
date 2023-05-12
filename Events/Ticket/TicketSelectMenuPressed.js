const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const ticketSchema = require("../../Database/ticketSchema");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isButton()) return;
        if (interaction.isChatInputCommand()) return;

        if (!["ticketselectmenu"].includes(interaction.customId)) return;

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "ticketselectmenu") {
                const choices = interaction.values;
 
                const result = choices.join("");

                const data = ticketSchema.findOne({ Guild: interaction.guild.id });
 
                const filter = { Guild: interaction.guild.id };
                const update = { Ticket: result };
         
                ticketSchema.updateOne(filter, update, {
                    new: true
                })
            } else {
                return;
            }
        }

        const modal = new ModalBuilder()
        .setTitle("Provide us with more information.")
        .setCustomId("TicketModal")
 
        const username = new TextInputBuilder()
        .setCustomId("username")
        .setRequired(true)
        .setLabel("Provide us with your username please.")
        .setPlaceholder("Username")
        .setStyle(TextInputStyle.Short)
 
        const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setRequired(true)
        .setLabel("The reason for this ticket?")
        .setPlaceholder("Give us a reason for opening this ticket")
        .setStyle(TextInputStyle.Short)

        const email = new TextInputBuilder()
        .setCustomId("email")
        .setRequired(false)
        .setLabel("Provide us with your email. (Optional)")
        .setPlaceholder("Enter your email here (Should be valid).")
        .setStyle(TextInputStyle.Short)
 
        const firstActionRow = new ActionRowBuilder().addComponents(username)
        const secondActionRow = new ActionRowBuilder().addComponents(reason)
        const thirdActionRow = new ActionRowBuilder().addComponents(email)
 
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        if (!interaction.isModalSubmit()) {
            interaction.showModal(modal);
        }
    }
};