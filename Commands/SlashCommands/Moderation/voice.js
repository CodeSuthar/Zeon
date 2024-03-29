const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Gives you a list of voice commands to moderate your voice channel.")
    .addSubcommand((subcommand) => subcommand
        .setName("kick")
        .setDescription("Kicks a user in your vc.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to kick from your vc.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("deafen")
        .setDescription("Deafens a user in your vc.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to deafen from your vc.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("undeafen")
        .setDescription("Undeafens a user in your vc.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to undeafen from your vc.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("mute")
        .setDescription("Mutes a user in your vc.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to mute from your vc.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("unmute")
        .setDescription("Unmutes a user in your vc.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to unmute from your vc.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("move")
        .setDescription("Moves a user from your vc to another.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to move from your vc.")
            .setRequired(true)
        )
        .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The channel you want to move the user to.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("list")
        .setDescription("Lists all users in your vc.")
    )
    .addSubcommand((subcommand) => subcommand
        .setName("info")
        .setDescription("Gives you info about your vc.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const SubCommand = interaction.options.getSubcommand();

        if (SubCommand === "kick") {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Move Members Or Administrator permission to use this command!` });

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Move Members Or Administrator permission to use this command!` });
        
            let member = interaction.options.getMember("user");
        
            if (!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }
            
            if (!member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
            }
        
            try {
                member.voice.disconnect();
                interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully Kicked <@${member.user.id}> From Voice!`)]});
            } catch(e) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice kick <@${member.user.id}>.`)]});
            }
        }

        if (SubCommand === "deafen") {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.DeafenMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Deafen Members Or Administrator permission to use this command!` });

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Deafen Members Or Administrator permission to use this command!` });
        
            let member = interaction.options.getMember("user");
        
            if (!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }
        
            if (!member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
            }

            if (member.voice.serverDeaf) {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already deafened.`)

                return interaction.editReply({embeds: [embed]});
            }
        
            try {
                member.voice.setDeaf(true, `Voice Deafen Command Ran By ${interaction.user.tag} (${interaction.user.id})`)
                interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully deafened <@${member.user.id}> From Voice!`)]})
            } catch(e) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice deafen <@${member.user.id}>.`)]})
            }
        }

        if (SubCommand === "undeafen") {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.DeafenMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Deafen Members Or Administrator permission to use this command!` });

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Deafen Members Or Administrator permission to use this command!` });
    
            let member = interaction.options.getMember("user");
    
            if(!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }
        
            if(!member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
            }

            if (!member.voice.serverDeaf) {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already undeafened.`)
    
                return message.reply({ embeds: [embed] })
            }
        
            try {
                member.voice.setDeaf(false, `Voice Undeafen Command Ran By ${interaction.user.tag} (${interaction.user.id})`)
                interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully undeafened <@${member.user.id}> From Voice!`)]})
            } catch(err) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice undeafen <@${member.user.id}>.`)]})
            }
        }

        if (SubCommand === "mute") {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Mute Members Or Administrator permission to use this command!` });

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Mute Members Or Administrator permission to use this command!` });
    
            let member = interaction.options.getMember("user");
        
            if (!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }
        
            if (!member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
            }

            if (member.voice.serverMute) {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already muted.`)
    
                return message.reply({ embeds: [embed] })
            }
        
            try {
                member.voice.setMute(true, `Voice Mute Command Ran By ${interaction.user.tag} (${interaction.user.id})`)
                interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully Muted <@${member.user.id}> From Voice!`)]})
            } catch(err) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice mute <@${member.user.id}>.`)]})
            }
        }

        if (SubCommand === "unmute") {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Mute Members Or Administrator permission to use this command!` });

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Mute Members Or Administrator permission to use this command!` });
    
            let member = interaction.options.getMember("user");
    
            if (!member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
            }
    
            if (!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }

            if (!member.voice.serverMute) {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already unmuted.`)
    
                return message.reply({ embeds: [embed] })
            }

            try {
                member.voice.setMute(false, `Voice Unmute Command Ran By ${interaction.user.tag} (${interaction.user.id})`)
                interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully Unmuted <@${member.user.id}> From Voice!`)]})
            } catch(err) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice unmute <@${member.user.id}>.`)]})
            }
        }

        if (SubCommand === "move") {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Move Members Or Administrator permission to use this command!` });

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Move Members Or Administrator permission to use this command!` });
    
            let member = interaction.options.getMember("user");

            let ch = interaction.options.getChannel("channel");
    
            if (!member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in a vc.`)]})
            }

            try {
                member.voice.setChannel(ch, `Voice Move Command Ran By ${interaction.user.tag} (${interaction.user.id})`)
                interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully Moved <@${member.user.id}> To Your Voice Channel!`)]})
            } catch(err) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to move <@${member.user.id}>.`)]})
            }
        }

        if (SubCommand === "list") {
            if (!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }
    
            let members = interaction.guild.members.cache.filter(m => m.voice?.channel?.id == interaction.member?.voice?.channel?.id).map(m => `${m.user.tag} | <@${m.user.id}>`).join(`\n`)
            
            return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(members).setTitle(`**Users in ${interaction.member.voice.channel.name} - ${interaction.member.voice.channel.members.size}**`)]})
        }

        if (SubCommand === "info") {
            if (!interaction.member.voice.channel) {
                return interaction.editReply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.wrong} | You must be connected to a voice channel first.`)]})
            }

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Voice Channel Info`)
            .setDescription(`**Name:** ${interaction.member.voice.channel.name}\n**ID:** ${interaction.member.voice.channel.id}\n**Bitrate:** ${interaction.member.voice.channel.bitrate}\n**User Limit:** ${interaction.member.voice.channel.userLimit}\n**Members:** ${interaction.member.voice.channel.members.size}`)

            return interaction.editReply({embeds: [embed]})
        }
    }
};