const { EmbedBuilder } = require("discord.js");
const moment = require("moment")
const verificationLevels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High"
}
const booster = {
    None: 'Level 0',
    1: 'Level: 1',
    2: 'Level: 2',
    3: 'Level: 3'
}

module.exports = {
    name: "serverinfo",
    category: "Information",
    aliases: ['si'],
    description: "Gives You Some Pretty Cool Information About The Server",
    usage: "!serverinfo]",
    run: async (message, args, client, prefix) => {
        const disabled = client.emoji.wrong;
        const enabled = client.emoji.tick;

        const guild = message.guild;
        const { createdTimestamp, ownerId , description} = guild;
        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
              return days + (days == 1 ? " day" : " days") + " ago";
        };

        const roles = guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1);
        let rolesdisplay;

        if (roles.length < 15) {
          rolesdisplay = roles.join(' ')
          if (roles.length < 1) rolesdisplay = "None"
        } else {
          rolesdisplay = `\`Too many roles to show..\``
        }

        if(rolesdisplay.length > 1024) rolesdisplay = `${roles.slice(4).join(" ")} \`more..\``
        const members = guild.members.cache;
        const channels = guild.channels.cache;
        const emojis = guild.emojis.cache;
        let data = guild.bannerURL;

        if(data){
            return message.reply({embeds: [new EmbedBuilder()
                .setColor("Random")
                .setTitle(`${guild.name}'s Information`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .setImage(guild.bannerURL({size: 4096}))
                .addFields(
                    {
                      name: '__About__',
                      value: `**Name**: ${guild.name} \n **ID**: ${guild.id} \n **Owner ${client.emoji.owner} :** <@!${guild.ownerId}> (${guild.ownerId})\n**Created at:** <t:${parseInt(createdTimestamp / 1000)}:R>\n**Members: **${guild.memberCount}`
                    },
                    {
                      name: '__Server Information__',
                      value: `**Verification Level:** ${verificationLevels[guild.verificationLevel]}\n**Inactive Channel: **${guild.afkChannelId ? `<#${guild.afkChannelId}>` : `${disabled}`}\n**Inactive Timeout: **${guild.afkTimeout/60} mins\n**System Messages Channel: **${guild.systemChannelId ? `<#${guild.systemChannelId}>` : disabled}\n**Boost Bar Enabled: **${guild.premiumProgressBarEnabled ? enabled : disabled}`
                    },
                    {
                      name: '__Channels__',
                      value: `**Total: ** ${channels.size}\n**Channels: **
                      ${client.emoji.discordcategory} ${channels.filter(channel => channel.type === 4).size} | ${client.emoji.discordtextchannel} ${channels.filter(channel => channel.type === 0).size} | ${client.emoji.discordannouncementchannel} ${channels.filter(channel => channel.type === 5).size} | ${client.emoji.discordvoicechannel} ${channels.filter(channel => channel.type === 2).size} | ${client.emoji.discordstagechannel} ${channels.filter(channel => channel.type === 13).size}`
                    },
                    {
                      name: '__Emoji Info__',
                      value: `**Regular:** ${emojis.filter(emoji => !emoji.animated).size} \n**Animated:** ${emojis.filter(emoji => emoji.animated).size} \n**Total:** ${emojis.size}`
                    },
                    {
                      name: '__Boost Status__',
                      value: `${booster[guild.premiumTier]} [${client.emoji.boosterbadge} ${guild.premiumSubscriptionCount || '0'} Boosts]`
                    },
                    {
                      name: `__Server Roles__ [${roles.length}]`,
                      value: `${rolesdisplay}`
                    }
                )
                .setTimestamp()
            ]})
        }
    }
};