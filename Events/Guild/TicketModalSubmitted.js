const { ButtonStyle, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const ticketSchema = require("../../Database/ticketSchema");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isButton()) return;
        if (interaction.isChatInputCommand()) return;
        if (interaction.isStringSelectMenu()) return;

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "TicketModal") {
                const data = await ticketSchema.findOne({ Guild: interaction.guild.id })
 
                const emailInput = interaction.fields.getTextInputValue("email")
                const usernameInput = interaction.fields.getTextInputValue("username")
                const reasonInput = interaction.fields.getTextInputValue("reason")
    
                const posChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
                if (posChannel) return await interaction.reply({ content: `You already have a ticket open - ${posChannel}`, ephemeral: true });
    
                const category = data.Channel;
    
                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`${interaction.user.id}'s Ticket`)
                    .setDescription("Welcome to your ticket! Please wait while the staff team review the details.")
                    .addFields(
                        { name: `Email`, value: `${emailInput ? emailInput : "Not Given By The User"}` },
                        { name: `Username`, value: `${usernameInput}` },
                        { name: `Reason`, value: `${reasonInput}` },
                        { name: `Type`, value: `${data.Ticket}` }
                    )
                    .setFooter({ text: `${interaction.guild.name}'s tickets.` })
    
                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("ticketclosebutton")
                    .setLabel("Close Ticket")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🗑️"),
                    new ButtonBuilder()
                    .setCustomId("ticketclaimbutton")
                    .setLabel("Claim Ticket")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🛄"),
                    new ButtonBuilder()
                    .setCustomId("ticketlockbutton")
                    .setLabel("Lock Ticket")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("🔒"),
                    new ButtonBuilder()
                    .setCustomId("ticketunlockbutton")
                    .setLabel("Unlock Ticket")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🔓")
                )

                let channel;

                let TId = Math.floor(Math.random() * 9000000000000) + 1000000000000;

                const tic = client.db.get(`ticket_${TId}`);

                if (tic) {
                    const newTId = Math.floor(Math.random() * 9000000000000) + 1000000000000;
                    TId = newTId;
                }
    
                await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}-`,
                    type: ChannelType.GuildText,
                    parent: category
                }).then((ch) => {
                    channel = ch;

                    client.db.set(`ticket_${NewID}`, {
                        GuildID: interaction.guild.id,
                        ChannelID: channel.id,
                        MembersID: interaction.user.id,
                        TicketID: NewID,
                        Closed: false,
                        Locked: false,
                        Type: data.Ticket,
                        Claimed: false
                    });
                })

                channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    'ViewChannel': false
                });

                channel.permissionOverwrites.edit(interaction.user, {
                    'ViewChannel': true,
                    'SendMessages': true
                });
     
                await channel.send({ embeds: [embed], components: [button] });
                interaction.reply({ content: `Your ticket is now open inside of ${channel}.`, ephemeral: true });
            }
        }
    }
};