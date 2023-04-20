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
                            .setLabel("🗑️ Close Ticket")
                            .setStyle(ButtonStyle.Danger)
                    )
    
                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: category
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