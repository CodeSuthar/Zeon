const { ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require("moment");
const { ApplicationCommandType } = require ('discord-api-types/v9');

module.exports = {
    ContextData: new ContextMenuCommandBuilder()
    .setName('User Info')
    .setType(ApplicationCommandType.User),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

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
        };

        let user = interaction.targetMember;

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
            { name: `General Information`, value: `Display Name: \`\`${user.user.displayName}\`\`\nUsername: \`${user.user.username}\` \nNickname: \`${nick}\`` },
            { name: `Overview`, value: `Badges: ${flagsArray.join(" ")}\nType: ${bot}` },
            { name: `Server Relating Information`, value: `Roles: ${user._roles[0] ? `<@&${user._roles.join(">  <@&")}>` : `\`No roles\``} \nKey Permissions: \`\`\`${finalPermissions.includes("Administrator") ? "Administrator (All Permissions Enabled)" : finalPermissions.join(', ') }\`\`\`` },
            { name: `Misc Information`, value: `Acc Created on: \`${moment(user.user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\`\nJoined This Server on: \`${moment(user.joinedAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\`` }
        )
        .setThumbnail(user.user.avatarURL())
        .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Random");
    
        return interaction.editReply({ embeds: [userlol] });
    }
};