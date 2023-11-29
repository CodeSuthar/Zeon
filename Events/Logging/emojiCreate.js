const { EmbedBuilder } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "emojiCreate",
    run: async (client, emoji) => {
        if (!emoji.guild) return;

        let embed = new EmbedBuilder()
        .setDescription(`**🆕 Emoji Created!**`)
        .addFields(
            { name: `😄 Server Emoji Added!`, value: `**We have new emoji in the server (${emoji})**` },
            { name: 'Emoji', value: `**${emoji}**` },
            { name: 'Emoji Name', value: `**\`:${emoji.name}:\`**` },
            { name: 'Emoji ID', value: `**${emoji.id}**` },
            { name: 'Emoji URL', value: `**[Click Me](${emoji.url})**` }
        )
        .setColor("Random")
        .setFooter({ text: `Emoji Created At` })
        .setTimestamp()

        return await sendMessage(emoji.guild, { embeds: [embed] }, "emojiLogs").catch((e) => {
            console.log(e);
        });
    }
};