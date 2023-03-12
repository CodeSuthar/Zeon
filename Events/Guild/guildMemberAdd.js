const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const db = require("../../Database/welcome.js");

module.exports = {
    name: "guildMemberAdd",
    run: async (client, member) => {
        const data = await db.findOne({ Guild: member.guild.id });
        if (!data) return;
        if (!data.Guild) return;
        if (!data.Channel) return;
        let CH = member.guild.channels.cache.get(data.Channel);
        if (!CH) CH = await member.guild.channels.fetch(data.Channel);
        let message = data.Description;

        if (message.includes("/membermention/")) message = message.replace("/membermention/", `<@${member.id}>`);

        if (message.includes("/servername/")) message = message.replace("/servername/", `${member.guild.name}`);

        if (message.includes("/servermc/")) message = message.replace("/servermc/", `${member.guild.memberCount}`);

        if (data.Embed) {
            const embed = new EmbedBuilder()
            .setTitle(`Yay! New Member Joined`)
            .setDescription(message)
            .setColor(`Random`)
            if (data.Button) {
                const button = new ButtonBuilder()
                .setStyle("Secondary")
                .setEmoji(client.emoji.join)
                .setLabel(`${member.guild.memberCount} Member's`)
                .setCustomId(`hehe`)
                .setDisabled(true)
                const row = new ActionRowBuilder()
                .addComponents(button)
                return CH.send({ content: `<@${member.id}>`, embeds: [embed], components: [row] })
            }
            return CH.send({ content: `<@${member.id}>`, embeds: [embed] })
        } else {
            if (data.Button) {
                const button = new ButtonBuilder()
                .setStyle("Secondary")
                .setEmoji("1017767816910356551")
                .setLabel(`${member.guild.memberCount} Member's`)
                .setCustomId(`hehe`)
                .setDisabled(true)
                const row = new ActionRowBuilder()
                .addComponents(button)
                return CH.send({ content: message, components: [row] })
            }
            return CH.send({ content: message })
        }
    }
}