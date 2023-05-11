const { EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts")
const ticketSchema = require("../../Database/ticketSchema");
const { channel } = require("diagnostics_channel");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) return;
        if (interaction.isStringSelectMenu()) return;
        if (interaction.isModalSubmit()) return;
        if (!["ticketclosebutton", "ticketclaimbutton", "ticketlockbutton", "ticketunlockbutton"].includes(interaction.customId)) return;

        if (interaction.isButton()) {
            const but = interaction.customId;
            switch (but) {
                case "ticketclosebutton":
                    let data = client.db.get(`ticket_${interaction.channel.id}`);

                    if (data.closed) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ content: "This ticket is already closed or is being closed!", ephemeral: true });
                    }

                    if (!interaction.replied) await interaction.deferReply();

                    const transcript = await createTranscript(interaction.channel, {
                        limit: -1,
                        returnBuffer: false,
                        filename: `ticket-${interaction.channel.id}.html`,
                    })

                    const transcriptEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Ticket Transcript")
                    .setDescription("Here is your ticket transcript!")
                    .addFields(
                        { name: "Ticket Type:", value: `${data.type}` },
                        { name: "Ticket Reason:", value: `${data.reason}` },
                        { name: "Ticket Id:", value: `${interaction.channel.id}` },
                    )
                    .setTimestamp()

                    const transcriptProcessingEmbed = new EmbedBuilder()
                    .setTitle("Saving Transcript...")
                    .setDescription("Please wait while we save your transcript..., it will be sent in dm (if dm opened) of the ticket owner and ticket log channel of this Guild.!")
                    .setColor("Random")
                    .setTimestamp()

                    const ticData = await ticketSchema.findOne({ Guild: interaction.guild.id });

                    const ticketLogChannel = interaction.guild.channels.cache.get(ticData.TicketLog) || interaction.guild.channels.fetch(ticData.TicketLog);

                    await interaction.editReply({ embeds: [transcriptProcessingEmbed] }).then(async () => {
                        await ticketLogChannel.send({
                            embeds: [transcriptEmbed],
                            files: [
                                transcript
                            ]
                        })

                        const member = await interaction.guild.members.cache.get(data.MembersID) || await interaction.guild.members.fetch(data.MembersID);

                        console.log(member)

                        member.send({
                            embeds: [transcriptEmbed],
                            files: [transcript]
                        }).catch(e => {
                            return interaction.channel.send({ content: "Couldn't send transcript to the ticket owner, maybe their dm is closed or they have blocked me!" })
                        })
                    })

                    await interaction.channel.delete();
                break;   
            }
        }
    }
};