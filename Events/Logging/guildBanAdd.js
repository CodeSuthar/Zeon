const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "guildBanAdd",
    run: async (client, ban) => {
        if (!ban.guild) return;

        let embed;

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanAdd,
        });

        const banLog = fetchedLogs.entries.filter((entry) => entry.target.id === ban.user.id).first();

        if (banLog) {
            if (banLog.executor.id === client.user.id) {
                const executorId = await client._bans.get(`${ban.user.id}_${ban.guild.id}`);
                const executor = await client.users.cache.get(executorId) || await client.users.fetch(executorId);

                if (!executor || !executorId) return;

                embed = new EmbedBuilder()
                .setTitle(`**🔨 Ban Hammer Has Spoken!**`)
                .setDescription(`**I have banned a member from the server (${ban.user}) on the order of (<@${executorId}>)!**`)
                .addFields(
                    { name: 'Member', value: `**${ban.user.username}**`, inline: true },
                    { name: 'Member ID', value: `**${ban.user.id}**`, inline: true },
                    { name: `Ban Reason`, value: `**${ban.reason || "No Reason Provided"}**` },
                    { name: 'Executor', value: `**${executor.username}**`, inline: true },
                    { name: 'Executor ID', value: `**${executorId}**`, }
                )
                .setColor("Random")
                .setFooter({ text: `Member Banned At` })
                .setTimestamp()
            } else {
                const { executor, executorId } = banLog;

                embed = new EmbedBuilder()
                .setTitle(`**🔨 Ban Hammer Has Spoken!`)
                .setDescription(`**${executor.username} has banned a member from the server (${ban.user})!**`)
                .addFields(
                    { name: 'Member', value: `**${ban.user.username}**`, inline: true },
                    { name: 'Member ID', value: `**${ban.user.id}**`, inline: true },
                    { name: `Ban Reason`, value: `**${ban.reason || "No Reason Provided"}**` },
                    { name: 'Executor', value: `**${executor.username}**`, inline: true },
                    { name: 'Executor ID', value: `**${executorId}**`, }
                )
                .setColor("Random")
                .setFooter({ text: `Member Banned At` })
                .setTimestamp()
            }
        } else {
            embed = new EmbedBuilder()
            .setTitle(`**🔨 Ban Hammer Has Spoken!**`)
            .setDescription(`**A member has been banned from the server (${ban.user})!**`)
            .addFields(
                { name: 'Member', value: `**${ban.user.username}**`, inline: true },
                { name: 'Member ID', value: `**${ban.user.id}**`, inline: true },
                { name: `Ban Reason`, value: `**${ban.reason || "No Reason Provided"}**` },
                { name: 'Executor', value: `**Executor Not Found**`, inline: true }
            )
            .setColor("Random")
            .setFooter({ text: `Member Banned At` })
            .setTimestamp()
        }

        await client._bans.delete(`${ban.user.id}_${ban.guild.id}`);

        return await sendMessage(ban.guild, { embeds: [embed] }, "guildBanLogs").catch((e) => {
            console.log(e);
        });
    }
};