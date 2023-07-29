const { EmbedBuilder } = require("discord.js");
const countingSchema = require("../../Database/countingSchema");

module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        const { guildId } = message;

        if (!message.guild || !message.channel || !message.id || message.author.bot) return;

        const Data = await countingSchema.findOne({ Guild: guildId });

        if (!Data || !Data.Channel) return;

        if (message.channel.id === Data.Channel) {
            if (isNaN(message.content)) return;

            if (message.author.id === Data.LastPerson || message.content < Data.Count || message.content > Data.Count) {
                const list = [
                    `is stupid who doesn't know how to count and ruined it at **${Data.Count}**. Start again from \`1\``,
                    `is a loser and messed it up at **${Data.Count}**. Start again from \`1\``,
                    `is an idiot who made everyone's hardwork ruined and messed it up at **${Data.Count}**. Start again from \`1\``,
                ]

                Data.Count = 1;
                Data.LastPerson = '';
                Data.LastMessage = '';
                Data.save();

                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${client.emoji.wrong} | Counting Messed Up`)
                        .setDescription(`<@${message.author.id}> ${list[Math.floor(Math.random() * list.length)]}`)
                        .setColor("Random")
                        .setTimestamp()
                    ]
                }).then((msg) => {
                    msg.react(client.emoji.angry)
                });

                return message.react(client.emoji.wrong);
            }

            if (message.content === `100` && Data.Count === 100) {
                message.react(client.emoji.hundred);
            } else {
                message.react(client.emoji.tick);
            }

            Data.Count++
            Data.LastPerson = message.author.id;
            Data.LastMessage = message.id
            Data.save();
        }
    }
};