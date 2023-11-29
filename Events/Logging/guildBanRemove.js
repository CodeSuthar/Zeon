const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "guildBanRemove",
    run: async (client, unban) => {
        if (!unban.guild) return;

        let embed;

        const fetchedLogs = await unban.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanRemove
        });

        const unbanLog = fetchedLogs.entries.filter((entry) => entry.target.id === unban.user.id).first();


        if (unbanLog) {
            if (unbanLog.executor.id === client.user.id) {
                const executorId = await client._bans.get(`${unban.user.id}_${unban.guild.id}`);
                const executor = await client.users.cache.get(executorId) || await client.users.fetch(executorId);

                if (!executor || !executorId) return;

                embed = new EmbedBuilder()
                .setTitle(`**🔨 Ban Hammer Has Spoken!**`)
                .setDescription(`**I have unbanned a member from the server (${unban.user}) on the order of (<@${executorId}>)!**`)
                .addFields(
                    { name: 'Member', value: `**${unban.user.username}**`, inline: true },
                    { name: 'Member ID', value: `**${unban.user.id}**`, inline: true },
                    { name: `Ban Reason`, value: `**${unban.reason || "No Reason Provided"}**` },
                    { name: 'Executor', value: `**${executor.username}**`, inline: true },
                    { name: 'Executor ID', value: `**${executorId}**`, }
                )
                .setColor("Random")
                .setFooter({ text: `Member Unbanned At` })
                .setTimestamp()
            } else {
                const { executor, executorId } = unbanLog;

                embed = new EmbedBuilder()
                .setTitle(`**🔨 Ban Hammer Has Spoken!**`)
                .setDescription(`**${executor.username} has unbanned a member from the server (${unban.user})!**`)
                .addFields(
                    { name: 'Member', value: `**${unban.user.username}**`, inline: true },
                    { name: 'Member ID', value: `**${unban.user.id}**`, inline: true },
                    { name: `Ban Reason`, value: `**${unban.reason || "No Reason Provided"}**` },
                    { name: 'Executor', value: `**${executor.username}**`, inline: true },
                    { name: 'Executor ID', value: `**${executorId}**`, }
                )
                .setColor("Random")
                .setFooter({ text: `Member Unbanned At` })
                .setTimestamp()
            }
        } else {
            embed = new EmbedBuilder()
            .setTitle(`**🔨 Ban Hammer Has Spoken!**`)
            .setDescription(`**A member has been unbanned from the server (${unban.user})!**`)
            .addFields(
                { name: 'Member', value: `**${unban.user.username}**`, inline: true },
                { name: 'Member ID', value: `**${unban.user.id}**`, inline: true },
                { name: `Ban Reason`, value: `**${unban.reason || "No Reason Provided"}**` },
                { name: 'Executor', value: `**Executor Not Found**`, inline: true }
            )
            .setColor("Random")
            .setFooter({ text: `Member Unbanned At` })
            .setTimestamp()
        }

        return await sendMessage(unban.guild, { embeds: [embed] }, "guildBanLogs").catch((e) => {
            console.log(e);
        });
    }
}