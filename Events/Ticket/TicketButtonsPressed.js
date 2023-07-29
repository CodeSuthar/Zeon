const { EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts")
const ticketSchema = require("../../Database/ticketSchema");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) return;
        if (interaction.isStringSelectMenu()) return;
        if (interaction.isModalSubmit()) return;
        if (!["ticketclosebutton", "ticketclaimbutton", "ticketlockbutton", "ticketunlockbutton"].includes(interaction.customId)) return;

        const emb = new EmbedBuilder().setColor("Random");

        if (interaction.isButton()) {
            const but = interaction.customId;
            switch (but) {
                case "ticketclosebutton":
                    let data = await client.db.get(`ticket_${interaction.channel.id}`);

                    if (data.closed) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ content: "This ticket is already closed or is being closed!", ephemeral: true });
                    }

                    if (!interaction.replied) await interaction.deferReply();

                    const transcriptEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Ticket Transcript")
                    .setDescription("Here is your ticket transcript!")
                    .addFields(
                        { name: "Ticket Type:", value: `${data.Type}` },
                        { name: "Ticket Reason:", value: `${data.Reason}` },
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
                        const transcript = await createTranscript(interaction.channel, {
                            limit: -1,
                            returnBuffer: false,
                            filename: `ticket-${interaction.channel.id}.html`,
                        })

                        await ticketLogChannel.send({
                            embeds: [transcriptEmbed],
                            files: [
                                transcript
                            ]
                        })

                        let member = await interaction.guild.members.cache.get(data.MembersID);

                        if (!member) member = await interaction.guild.members.fetch(data.MembersID);

                        await member.send({
                            embeds: [transcriptEmbed],
                            files: [transcript]
                        });
                    })

                    data.Closed = true;

                    await client.db.set(`ticket_${interaction.channel.id}`, data);

                    await interaction.channel.delete();
                break;
                case "ticketclaimbutton":
                    let set = await client.db.get(`ticket_${interaction.channel.id}`);

                    const TicDat = await ticketSchema.findOne({ Guild: interaction.guild.id });

                    if (!interaction.member.roles.cache.has(TicDat.Handler)) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ embeds: [emb.setDescription(`You need to have the <@&${TicDat.Handler}> role to claim this ticket!`)] });
                    }

                    if (set.Claimed) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ embeds: [emb.setDescription(`This ticket is already claimed by <@${set.ClaimedBy}>`)] });
                    }

                    if (!interaction.replied) await interaction.deferReply();

                    interaction.channel.edit({
                        topic: `Ticket Id: ${interaction.channel.id}\nTicket Owner: <@${set.MembersID}>\nReason: ${set.Reason}\nEmail: ${set.Email}\nTicket Type: ${set.Type}\nClaimed By: <@${interaction.user.id}>`
                    })

                    set.Claimed = true;
                    set.ClaimedBy = interaction.user.id;

                    await client.db.set(`ticket_${interaction.channel.id}`, set);

                    return await interaction.editReply({ embeds: [emb.setDescription(`This ticket has been successfully claimed by <@${interaction.user.id}>`)] });
                break;
                case "ticketlockbutton":
                    let sett = await client.db.get(`ticket_${interaction.channel.id}`);

                    const TicDat1 = await ticketSchema.findOne({ Guild: interaction.guild.id });
                    
                    if (!interaction.member.roles.cache.has(TicDat1.Handler)) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ embeds: [emb.setDescription(`You need to have the <@&${TicDat1.Handler}> role to lock this ticket!`)] });
                    }

                    if (sett.Locked) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ embeds: [emb.setDescription(`The mode of ticket is already set to locked.`)] });
                    }

                    if (!interaction.replied) await interaction.deferReply();

                    interaction.channel.permissionOverwrites.edit(sett.MembersID, {
                        SendMessages: false
                    });

                    sett.Locked = true;

                    await client.db.set(`ticket_${interaction.channel.id}`, sett);

                    return await interaction.editReply({ embeds: [emb.setDescription(`${client.emoji.lock} | This ticket has been locked successfully.`)] });
                break;
                case "ticketunlockbutton":
                    let settt = await client.db.get(`ticket_${interaction.channel.id}`);

                    const TicDat2 = await ticketSchema.findOne({ Guild: interaction.guild.id });

                    if (!interaction.member.roles.cache.has(TicDat2.Handler)) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ embeds: [emb.setDescription(`You need to have the <@&${TicDat2.Handler}> role to unlock this ticket!`)] });
                    }

                    if (!settt.Locked) {
                        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

                        client.timertowait(2000);

                        return await interaction.editReply({ embeds: [emb.setDescription(`The mode of ticket is already set to unlocked.`)] });
                    }

                    if (!interaction.replied) await interaction.deferReply();

                    interaction.channel.permissionOverwrites.edit(settt.MembersID, {
                        SendMessages: true
                    });

                    settt.Locked = false;

                    await client.db.set(`ticket_${interaction.channel.id}`, settt);

                    return await interaction.editReply({ embeds: [emb.setDescription(`${client.emoji.unlock} | This ticket has been unlocked successfully.`)] });
                break;
            }
        }
    }
};
