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
            if (Data.LastMessage === message.id) {
                const embed = new EmbedBuilder()
                .setTitle(`${client.emoji.wrong} | Last Number Was Deleted By Someone`)
                .setDescription(`> **Watch Out**, ⚠️ Caution: The last counted number was deleted. So, Keep in mind that the\n> Last Number was \`${Data.Count - 1}\``)
                .setColor("Random")
                .setTimestamp()

                message.channel.send({ embeds: [embed] });
            } else return
        } else  return
    }
};