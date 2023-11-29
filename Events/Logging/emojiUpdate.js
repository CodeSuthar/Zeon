const { EmbedBuilder } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: "emojiUpdate",
    run: async (client, oldEmoji, newEmoji) => {
        if (!oldEmoji.guild) return;

        let embed = new EmbedBuilder()
        .setDescription(`**🔄 Emoji Updated!**`)
        .addFields(
            { name: `😎 Server Emoji Updated!`, value: `**We have updated an emoji in the server (${newEmoji})**` },
            { name: 'Emoji', value: `**${newEmoji}**` },
            { name: 'Emoji Name', value: `**\`:${newEmoji.name}:\`**` },
            { name: 'Emoji ID', value: `**${newEmoji.id}**` },
            { name: 'Emoji URL', value: `**[Click Me](${newEmoji.url})**` }
        )
        .setColor("Random")
        .setFooter({ text: `Emoji Updated At` })
        .setTimestamp()

        return await sendMessage(newEmoji.guild, { embeds: [embed] }, "emojiLogs").catch((e) => {
            console.log(e);
        });
    }
};