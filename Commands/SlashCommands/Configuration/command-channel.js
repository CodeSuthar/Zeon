const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("command-channel")
    .setDescription("Help's you in add, remove of Zeon command channels only system.")
    .addSubcommand((subcommand) => subcommand
        .setName("add")
        .setDescription("Setups the advanced bot command channel only system!.")
        .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The Channel where you want to enable The Bot to listen commands")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("remove")
        .setDescription("Setups the advanced bot command channel only system!.")
        .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The Channel where you want to remove tThe Bot to listen commands")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("remove-all")
        .setDescription("Disable the bot command channels only system!.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Manage Guild Or Administrator permission to use this command!` });

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "add": 
                const data = await client.db.get(`botcommandchannel_${interaction.guild.id}`);

                if (data) {
                    const datachannel = await client.db.get(`botcommandchannel_channel_${interaction.guild.id}`);
                  
                    const channel = interaction.options.getChannel("channel");

                    if (datachannel.includes(channel.id)) {            
                        const setupembed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`> <#${channel.id}> Is Already Included Bot Text Channels List.`)
                          
                        return interaction.editReply({ embeds: [setupembed] });
                    } else {
                        let datachannell = await client.db.get(`botcommandchannel_channel_${interaction.guild.id}`);

                        const map = datachannell.map((go) => `<#${go}>`).join(", ");
                      
                        await datachannell.push(channel.id);

                        await client.db.set(`botcommandchannel_channel_${interaction.guild.id}`, datachannell);

                        const setupembed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`> This Channel Is Added In The Bot Text Channels List And Enable The Bot Text Channel In <#${channel.id}> With ${map} And Bot Will Listen To Command In These Specific Channel Only.`)

                        return interaction.editReply({ embeds: [setupembed] }); 
                    }  
                } else {
                    const channel = interaction.options.getChannel("channel");

                    await client.db.set(`botcommandchannel_${interaction.guild.id}`, true).then(() => {
                        client.db.set(`botcommandchannel_channel_${interaction.guild.id}`, [ `${channel.id}` ]);
                    });
                    
                    const setuppembed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`> This Channel Is Added In The Bot Text Channels List And Enabled The Bot Text Channel In <#${channel.id}> And Bot Will Listen To Command In This Specific Channel Only.`)

                    return interaction.editReply({ embeds: [setuppembed] });
                }

            break;

            case "remove":
                const dataa = await client.db.get(`botcommandchannel_${interaction.guild.id}`);

                if (!dataa) {
                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`> Bot Text Channels Is Not Setupped. So, I Can't Disable It.`)

                    return interaction.editReply({ embeds: [setupembed] })
                } else {
                    const op = await client.db.get(`botcommandchannel_channel_${interaction.guild.id}`);

                    const channel = interaction.options.getChannel("channel");

                    if (!op.includes(channel.id)) {
                        const setuppembed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`> The Channel Is Not Available In The Bot Command Channel List. So, Can't Remove It.`)

                        return interaction.editReply({
                            embeds: [ setuppembed ]
                        });                      
                    } 

                    await op.shift(channel.id);

                    if (op.length === 0) {
                        await client.db.delete(`botcommandchannel_${interaction.guild.id}`);
                        await client.db.delete(`botcommandchannel_channel_${interaction.guild.id}`);

                        const setupembed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                        .setFooter({ text: `🤖 | System Setup`})
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTimestamp()
                        .addFields({ name: `• Bot Command Channel Is Disabled Now`, value: `> Bot Will Listen Commands From Any Channel, As The Bot Command Channel System Has Been Deleted! Due To Being 1 Channel In The List And You Removed It Too.`})

                        return interaction.editReply({ embeds: [setupembed] });
                    } else if (op.length === 1) {
                        await client.db.set(`botcommandchannel_channel_${interaction.guild.id}`, op);

                        const setupembed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                        .setFooter({ text: `🤖 | System Setup`})
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTimestamp()
                        .addFields({ name: `• Bot Command Channel Has Been Removed`, value: `> Successfully Removed <#${channel.id}>. Now, You Can Use Command In This <#${op[0]}> Channel.`})

                        return interaction.editReply({ embeds: [setupembed] });
                    } else {
                        await client.db.set(`botcommandchannel_channel_${interaction.guild.id}`, op);

                        const map = op.map((go) => `<#${go}>`).join(", ");

                        const setupembed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                        .setFooter({ text: `🤖 | System Setup`})
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTimestamp()
                        .addFields({ name: `• Bot Command Channel Has Been Removed`, value: `> Successfully Removed <#${channel.id}>. Now, You Can Use Command In These ${map} Channel.`})

                        return interaction.editReply({ embeds: [setupembed] });
                    }
                }
            break;

            case "remove-all":
                const data2 = await client.db.get(`botcommandchannel_${interaction.guild.id}`);
                
                if (!data2) {
                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                    .setFooter({ text: `🤖 | System Setup`})
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields({ name: `• Error:`, value: `> Bot Command Channel Is Not Setupped. So, I Can't Disable It.`})

                    return interaction.editReply({ embeds: [setupembed] })
                } else {
                    await client.db.delete(`botcommandchannel_${interaction.guild.id}`);

                    await client.db.delete(`botcommandchannel_channel_${interaction.guild.id}`);

                    const setupembed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: `🤖 | Bot Command Channel Only System`})
                    .setFooter({ text: `🤖 | System Setup`})
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields({ name: `• Bot Command Channel Is Disabled Now`, value: `> Bot Will Listen Commands From Any Channel, As The Bot Command Channel System Has Been Deleted!.`})

                    return interaction.editReply({ embeds: [setupembed] })
                }
            break;
        }
    }
};