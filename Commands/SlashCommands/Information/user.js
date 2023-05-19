const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const moment = require("moment");
const UserSchema = require("../../../Database/user.js");
const discordinfo = require("discordinfo.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Shows you the information/profile about a user.")
    .addSubcommand(subcommand => subcommand
        .setName("info")
        .setDescription("Shows you the information about a user.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to get the information about.")
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("profile")
        .setDescription("Shows you the profile of a user.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to get the profile about.")
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("avatar")
        .setDescription("Shows you the avatar of a user.")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("User to get avatar of.")
            .setRequired(true)
        )
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const Subcommand = interaction.options.getSubcommand();

        if (Subcommand === "info") {
            const permissions = {
                Administrator: "Administrator",
                AddReactions: "Add Reactions",
                AttachFiles: "Attach Files",
                BanMembers: "Ban Members",
                ChangeNickname: "Change Nickname",
                Connect: "Connect Voice Channels",
                CreateInstantInvite: "Create Instant Invite",
                CreatePrivateThreads: "Create Private Threads",
                CreatePublicThreads: "Create Public Threads",
                DeafenMembers: "Deafen Members",
                EmbedLinks: "Embed Links",
                KickMembers: "Kick Members",
                ManageChannels: "Manage Channels",
                ManageGuildExpressions: "Manage Emojis And Stickers",
                ManageEvents: "Manage Events",
                ManageGuild: "Manage Guild",
                ManageMessages: "Manage Messages",
                ManageNicknames: "Manage Nicknames",
                ManageRoles: "Manage Roles",
                ManageThreads: "Manage Threads",
                ManageWebhooks: "Manage Webhooks",
                MentionEveryone: "Mention Everyone",
                ModerateMembers: "Moderate Members",
                MoveMembers: "Move Members",
                MuteMembers: "Mute Members",
                PrioritySpeaker: "Priority Speaker",
                ReadMessageHistory: "Read Message History",
                RequestToSpeak: "Request To Speak",
                SendMessages: "Send Messages",
                SendMessagesInThreads: "Send Messages In Threads",
                SendTTSMessages: "Send TTS Messages",
                Speak: "Speak",
                Stream: "Stream",
                UseApplicationCommands: "Use Application Commands",
                UseEmbeddedActivities: "Use Embedded Activities",
                UseExternalEmojis: "Use External Emojis",
                UseExternalStickers: "Use External Stickers",
                UseVAD: "Use Voice Activity",
                ViewAuditLog: "View Audit Log",
                ViewChannel: "View Channel",
                ViewGuildInsights: "View Guild Insights"
            }
    
            let user = interaction.options.getMember("user");
            if (!user) user = interaction.member;
    
            const nick = user.nickname === null ? "Not Available" : user.nickname;
            const roles = user.roles.cache.get === "" ? "None" : user.roles.cache.get;
            const usericon = user.user.displayAvatarURL({ dynamic: true, size: 2048 });
            const mentionPermissions = user.permissions.toArray() === null ? "None" : user.permissions.toArray();
            const finalPermissions = [];
            for (const permission in permissions) {
                if (mentionPermissions.includes(permission)) finalPermissions.push(`${permissions[permission]}`);
                else;
            }
    
            var flags = {
                "": "None",
                "Staff": client.emoji.staff,
                "Partner": client.emoji.partner,
                "BugHunterLevel1": client.emoji.bughunterlevel1,
                "BugHunterLevel2": client.emoji.bughunterlevel2,
                "Hypesquad": client.emoji.hypesquad,
                "HypeSquadOnlineHouse2": client.emoji.hypesquadbrilliance,
                "HypeSquadOnlineHouse1": client.emoji.hypesquadbravery,
                "HypeSquadOnlineHouse3": client.emoji.hypesquadbalance,
                "PremiumEarlySupporter": client.emoji.premiumearlysupporter,
                "VerifiedBot": client.emoji.verifiedbot,
                "VerifiedDeveloper": client.emoji.verifiedbotdeveloper,
                "ActiveDeveloper": client.emoji.activedeveloper
            };
            const flagsArray = [];
            for (const flag in flags) {
                if (user.user.flags.toArray().includes(flag)) flagsArray.push(`${flags[flag]}`);
                else;
            }
            var bot = user.user.bot ? "Bot" : "User";
            const userlol = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}'s Information`, iconURL: user.user.avatarURL()})
            .setThumbnail(usericon)
            .addFields(
                { name: `General Information`, value: `Name: \`\`${user.user.username}\`\`\nDiscriminator: \`${user.user.discriminator}\` \nNickname: \`${nick}\`` },
                { name: `Overview`, value: `Badges: ${flagsArray.join(" ")}\nType: ${bot}` },
                { name: `Server Relating Information`, value: `Roles: ${user._roles[0] ? `<@&${user._roles.join(">  <@&")}>` : `\`No roles\``} \nKey Permissions: \`\`\`${finalPermissions.includes("Administrator") ? "Administrator (All Permissions Enabled)" : finalPermissions.join(', ') }\`\`\`` },
                { name: `Misc Information`, value: `Acc Created on: \`${moment(user.user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\`\nJoined This Server on: \`${moment(user.joinedAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\`` }
            )
            .setThumbnail(user.user.avatarURL())
            .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setColor("Random");
    
            return interaction.editReply({ embeds: [userlol] });
        } else if (Subcommand === "profile") {
            let member = interaction.options.getMember("user");

            let data = await UserSchema.findOne({ UserId: member.id });

            if (!data) {
                const newUser = new UserSchema({
                  UserId: member.id,
                });
    
                await newUser.save();
    
                data = await UserSchema.findOne({ UserId: member.id });
            }

            let badge;
    
            if (data && data.badges) {
                badge = data.badges.join("\n");
                if (!badge || !badge.length) badge = `\`None\``;
            } else {
                badge = `\`None\``;
            }

            const embed = new EmbedBuilder()
            .setTitle("Profile")
            .setDescription(`User: **${member.user.tag}**`)
            .addFields({ name: "Badges", value: badge })
            .setColor("Random");

            return interaction.editReply({ embeds: [embed] });
        } else if (Subcommand === "avatar") {

            let mention = interaction.options.getMember("user");
    
            const avatar = mention.displayAvatarURL({ dynamic: true, size: 2048, format: "png" })
        
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${mention.user.tag}'s Avatar `, iconURL: avatar })
            .setDescription(`\`Click the button below to download!\``)
            .setImage(avatar)
            .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setColor("Random")
    
            const link = mention.displayAvatarURL({ dynamic: true, size: 2048, format: "gif" })
        
            const dlbutton = new ButtonBuilder()
            .setLabel(`PNG`)
            .setURL(`${link.replace("gif", "png")}`)
            .setStyle("Link")
        
            const dlbutton2 = new ButtonBuilder()
            .setLabel(`JPG`)
            .setURL(`${link.replace("gif", "jpg")}`)
            .setStyle("Link")
        
            const dlbutton3 = new ButtonBuilder()
            .setLabel(`WEBP`)
            .setURL(`${link.replace("gif", "webp")}`)
            .setStyle("Link")
        
            let row = new ActionRowBuilder()
            .addComponents(dlbutton, dlbutton2, dlbutton3)
    
            const info = new discordinfo({
                token: client.config.Bot.Token
            });
    
            const syt = await info.getUser(mention.id);
    
            if (syt.avatar.startsWith(`a_`)) {
                const dlbutton4 = new ButtonBuilder()
                .setLabel(`GIF`)
                .setURL(link)
                .setStyle("Link")
    
                row = new ActionRowBuilder()
                .addComponents(dlbutton, dlbutton2, dlbutton3, dlbutton4)
            }
        
            return interaction.editReply({ embeds: [embed], components: [row] })
        }
    }
};