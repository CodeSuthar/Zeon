const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js");
module.exports = {
    name: "glist",
    aliases: [""],
    category: "Giveaway",
    description: "To see all giveaways in server",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`Manage Server Or Administrator\` permissions to execute this comand!`);

        const select = new StringSelectMenuBuilder().setCustomId("select").setPlaceholder("Choose a type of giveaway to view!").addOptions([
            {
                label: "Normal Giveaways!",
                description: "Check the normal giveaways currently running in your server!",
                value: 'normal',
            },
            {
                label: "Requirement Giveaways!",
                description: "Check the requirement giveaways currently running in your server!",
                value: "guildReq"
            },
        ])

        const row = new ActionRowBuilder().addComponents([select])

        let giveaways = client.GiveawayManager.giveaways.filter(g => g.guildId === `${message.guild.id}` && !g.ended);

        if (!giveaways.some(e => e.messageId)) {
           return message.reply("No Giveaways In this server")
        }

        await message.reply({ embeds: [new EmbedBuilder().setDescription("Choose an option in the select menu to get started!").setColor("Random").setTimestamp()], components: [row] })

        let embed = new EmbedBuilder()
        .setTitle("Currently Active Giveaways")
        .setColor("Random")
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()

        let embedGuild = new EmbedBuilder()
        .setTitle("Currently Active Requirement Giveaways")
        .setColor("Random")
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()

        const filter = x => x.customId == "select" && x.user.id == message.author.id;
        const collector = await message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })

        collector.on("collect", async (i) => {
            i.update({ components: [] });
            const val = i.values[0]
            if (val == "normal") {
                await Promise.all(giveaways.map(async (x) => {
                embed.addFields({ name: `Normal Giveaways:`, value: `**Prize:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})\nStarted:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Ends:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)` })}));
                msg.edit({ embeds: [embed] });
            }

            if (val == "guildReq") {
                if (!giveaways.some(e => e.extraData)) return msg.edit({ content: "No Giveaways In this server", embeds: [] }).catch(e => console.error(e))
                await Promise.all(giveaways.map(async (x) => {
                    if (x.extraData) {
                        const guild = client.guilds.cache.get(x.extraData.server)
                        const channel = guild.channels.cache.filter((channel) => channel.type === 'text').first()
                        const inv = await channel.createInvite()
                        embedGuild.addFields({ name: `Requirement Giveaways:`, value: `**Prize:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})**\n**Requirement: [This Server](${inv})**\n**Started** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Ends:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)` })
                    }
                }));
                msg.edit({ embeds: [embedGuild] })
            }
        })

        collector.on("end", (collected, reason) => {
            if (reason == "time") msg.edit({ content: "👀 Collector Destroyed, Try Again!", components: [] })
        })
    }
}