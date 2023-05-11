const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require("discord.js");
const ticketSchema = require("../../../Database/ticketSchema");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Help's you in setup, de-setup of advanced ticket system.")
    .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("Setups the advanced ticket system!.")
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
        .addRoleOption(option => option
            .setName("access-role")
            .setDescription("The role you want to give access and handling permission of the ticket system.")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("ticket-log")
            .setDescription("The channel you want to send the ticket logs in.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("de-setup")
        .setDescription("De-setups the advanced Ticket System!.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Guild Or Administrator permission to use this command!` });

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "setup":
                const channel = interaction.options.getChannel("channel");
                const category = interaction.options.getChannel("category");
                const role = interaction.options.getRole("access-role");
                const log = interaction.options.getChannel("ticket-log");
                
                const data = await ticketSchema.findOne({ Guild: interaction.guild.id });

                if (!data) {
                    ticketSchema.create({
                        Guild: interaction.guild.id,
                        Channel: category.id,
                        Ticket: "first",
                        Handler: role.id,
                        TicketLog: log.id
                    })
                } else {
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
                        new StringSelectMenuOptionBuilder()
                        .setLabel("General Support")
                        .setValue("Subject: General Support")
                        .setDescription("Get help with general issues.")
                        .setEmoji("📰"),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Moderation Support")
                        .setValue("Subject: Moderation Support")
                        .setDescription("Get help with moderation issues.")
                        .setEmoji("🛠️"),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Server Support")
                        .setValue("Subject: Server Support")
                        .setDescription("Get help with server issues.")
                        .setEmoji("🥶"),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Billing/Payment Support")
                        .setValue("Subject: Billing/Payment Support")
                        .setDescription("Get help with billing/payment issues.")
                        .setEmoji("💳"),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Other")
                        .setValue("Subject: Other")
                        .setDescription("Get help with other issues.")
                        .setEmoji("🔍"),
                    )
                )
 
                await channel.send({ embeds: [embed], components: [menu] }).then(async (msg) => {
                    await client.db.set(`ticket_message_${interaction.guild.id}_message`, msg.id)
                    await client.db.set(`ticket_channel_${interaction.guild.id}`, msg.channel.id)
                });

                await interaction.editReply({ content: `Your ticket system has been set up in ${channel}` });

            break;

            case "de-setup":
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