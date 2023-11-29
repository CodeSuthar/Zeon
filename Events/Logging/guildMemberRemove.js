const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        // Guild Declarations
        const guild = member.guild;
        const guildId = guild.id;

        // Check If The Member Was Kicked Or Has Left The Server
        let isKick;
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick
        });
        const KickSorted = fetchedLogs.entries.first().then(async (entry) => {
            if (entry.target.id === member.id) isKick = true;
            else isKick = false;
        });

        // Embed Design
        let emb;
        if (isKick) {
            if (KickSorted) {
                if (KickSorted.executor.id === client.user.id) {
                    const executorId = await client._kicks.get(`${member.user.id}_${guildId}`);
                    const executor = await client.users.cache.get(executorId) || await client.users.fetch(executorId);
    
                    if (!executor || !executorId) return;
    
                    emb = new EmbedBuilder()
                    .setTitle('Member Kicked!')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**I have kicked a member from the server (${member.user}) on the order of (<@${executorId}>)!**`)
                    .addFields(
                        { name: 'Member', value: `**${member.user.username}**`, inline: true },
                        { name: 'Member ID', value: `**${member.user.id}**`, inline: true },
                        { name: 'Executor', value: `**${executor.username}**`, inline: true },
                        { name: 'Executor ID', value: `**${executorId}**`, }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Member Kicked At` })
                    .setTimestamp();
                } else {
                    const { executor, executorId } = KickSorted;
    
                    emb = new EmbedBuilder()
                    .setTitle('Member Kicked!')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**${executor.username} has kicked a member from the server (${member.user})!**`)
                    .addFields(
                        { name: 'Member', value: `**${member.user.username}**`, inline: true },
                        { name: 'Member ID', value: `**${member.user.id}**`, inline: true },
                        { name: 'Executor', value: `**${executor.username}**`, inline: true },
                        { name: 'Executor ID', value: `**${executorId}**`, }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Member Kicked At` })
                    .setTimestamp();
                }
            } else {
                emb = new EmbedBuilder()
                .setTitle('Member Left!')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`${member.user.tag} has left the server!`)
                .setFooter({ text: `ID: ${member.user.id} - Left At` })
                .setTimestamp();
            }

            // Returning The Embed For Logging
            return await sendMessage(guild, { embeds: [emb] }, "guildMemberLogs").catch((e) => {
                console.log(e);
            });
        }
    }
};