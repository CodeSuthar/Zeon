const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "userinfo",
    cateregory: "Information",
    description: "Gives You Some Pretty Cool Information About The User",
    usage: "!userinfo || !userinfo",
    run: async (message, args, client, prefix) => {
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
            ManageEmojisAndStickers: "Manage Emojis And Stickers",
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
        let mention = message.mentions.members.first();

        if (!mention) {
            if (args[0]) {
                mention = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            } else {
                mention = message.member;
            }
        }
        const nick = mention.nickname === null ? "Not Available" : mention.nickname;
        const roles = mention.roles.cache.get === "" ? "None" : mention.roles.cache.get;
        const usericon = mention.user.displayAvatarURL({ dynamic: true, size: 2048 });
        const mentionPermissions = mention.permissions.toArray() === null ? "None" : mention.permissions.toArray();
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
            if (mention.user.flags.toArray().includes(flag)) flagsArray.push(`${flags[flag]}`);
            else;
        }
        var bot = mention.user.bot ? "Bot" : "User";
        const userlol = new EmbedBuilder()
        .setAuthor({ name: `${message.author.username}'s Information`, iconURL: mention.user.avatarURL()})
        .setThumbnail(usericon)
        .addFields(
            { name: `General Information`, value: `Name: \`\`${mention.user.username}\`\`\nDiscriminator: \`${mention.user.discriminator}\` \nNickname: \`${nick}\`` },
            { name: `Overview`, value: `Badges: ${flagsArray.join(" ")}\nType: ${bot}` },
            { name: `Server Relating Information`, value: `Roles: ${mention._roles[0] ? `<@&${mention._roles.join(">  <@&")}>` : `\`No roles\``} \nKey Permissions: \`\`\`${finalPermissions.includes("Administrator") ? "Administrator (All Permissions Enabled)" : finalPermissions.join(', ') }\`\`\`` },
            { name: `Misc Information`, value: `Acc Created on: \`${moment(mention.user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\`\nJoined This Server on: \`${moment(mention.joinedAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\`` }
        )
        .setThumbnail(mention.user.avatarURL())
        .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
        .setColor("Random");

        message.reply({ embeds: [userlol] })
    }
}