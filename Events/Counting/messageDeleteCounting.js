const { EmbedBuilder } = require("discord.js");
const countingSchema = require("../../Database/countingSchema");

module.exports = {
    name: 'messageDelete',
    run: async (client, message) => {
        const { guildId } = message;

        if (!message.guild || !message.channel || !message.id) return;

        const Data = await countingSchema.findOne({ Guild: guildId });

        if (!Data || !Data.Channel) return;

        if (message.channel.id === Data.Channel) {
            const embed = new EmbedBuilder()
            .setTitle(`${client.emoji.wrong} | Counted Number Was Deleted By Someone`)
            .setDescription(`> **Watch Out**, ⚠️ Caution: The deleted number can be the last number which was counted. So, Keep in mind that the\n> Last Number was \`${Data.Count - 1}\``)
            .setColor("Random")
            .setTimestamp()

            message.channel.send({ embeds: [embed] });
        }
    }
};