const { EmbedBuilder } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "emojiDelete",
    run: async (client, emoji) => {
        if (!emoji.guild) return;

        let embed = new EmbedBuilder()
        .setDescription(`**❌ Emoji Deleted!**`)
        .addFields(
            { name: `😭 Server Emoji Deleted!`, value: `**We have lost an emoji in the server (${emoji})**` },
            { name: 'Emoji', value: `**${emoji}**` },
            { name: 'Emoji Name', value: `**\`:${emoji.name}:\`**` },
            { name: 'Emoji ID', value: `**${emoji.id}**` },
            { name: 'Emoji URL', value: `**[Click Me](${emoji.url})**` }
        )
        .setColor("Random")
        .setFooter({ text: `Emoji Deleted At` })
        .setTimestamp()

        return await sendMessage(emoji.guild, { embeds: [embed] }, "emojiLogs").catch((e) => {
            console.log(e);
        });
    }
};