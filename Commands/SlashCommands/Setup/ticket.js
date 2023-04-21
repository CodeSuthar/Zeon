const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require("discord.js");
const ticketSchema = require("../../../Database/ticketSchema");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Modifying Or Setting Up Of Advanced Ticket System")
    .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("Enables The Advanced Ticket System!.")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel you want to set up the ticket system in.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName("category")
            .setDescription("The category you want to send the tickets in.")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("disable")
        .setDescription("Disables The Advanced Ticket System!.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply({ content: "You must have the Manage Guild Or Administrator permission to use this command!" });

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "setup":
                const channel = interaction.options.getChannel("channel");
                const category = interaction.options.getChannel("category");
                
                const data = await ticketSchema.findOne({ Guild: interaction.guild.id });

                if (!data) {
                    ticketSchema.create({
                        Guild: interaction.guild.id,
                        Channel: category.id,
                        Ticket: "first"
                    })
                } else {
                    console.log(data)
                    return await interaction.editReply({ content: "You already have a ticket system set up. You can run /ticket-disable to remove it and restart." })
                }

                const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Ticket System")
                .setDescription("Open a ticket to talk with staff about an issue.")
                .setFooter({ text: `${interaction.guild.name} tickets!` })
 
                const menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId("ticketselectmenu")
                    .setMaxValues(1)
                    .setPlaceholder("🥶 Select A Topic")
                    .addOptions(
                        {
                            label: "🌐 General Support",
                            value: "Subject: General Support"
                        },
                        {
                            label: "🛠️ Moderation Support",
                            value: "Subject: Moderation Support"
                        },
                        {
                            label: "🥶 Server Support",
                            value: "Subject: Server Support"
                        },
                        {
                            label: "💸 Other",
                            value: "Subject: Other"
                        },
                    )
                )
 
                await channel.send({ embeds: [embed], components: [menu] }).then(async (msg) => {
                    await client.db.set(`ticket_message_${interaction.guild.id}_message`, msg.id)
                    await client.db.set(`ticket_channel_${interaction.guild.id}`, msg.channel.id)
                });

                await interaction.editReply({ content: `Your ticket system has been set up in ${channel}` });

            break;

            case "disable":
                const db  = await client.db.get(`ticket_channel_${interaction.guild.id}`);
                const db1 = await client.db.get (`ticket_message_${interaction.guild.id}_message`);

                if (!db && !db1) return interaction.editReply({ content: "You don't have a ticket system set up. You can run /ticket-setup to set one up." });

                const channel1 = await interaction.guild.channels.cache.get(db) || await interaction.guild.channels.fetch(db);

                const messages = await channel1.messages.cache.get(db1) || await channel1.messages.fetch(db1);

                await messages.delete();

                await client.db.delete(`ticket_channel_${interaction.guild.id}`).catch((e) => console.log(e));
                await client.db.delete(`ticket_message_${interaction.guild.id}`).catch((e) => console.log(e));

                ticketSchema.deleteMany({ Guild: interaction.guild.id }).then(() => {
                    interaction.editReply({ content: "Your ticket system has been removed" })
                });
        }
    }
};