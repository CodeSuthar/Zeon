const { PermissionsBitField } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "greroll",
    category: "Giveaway",   
    description: "To Reroll A Giveaway Winner",
    usage: "greroll <message id>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`Manage Server Or Administrator\` permissions to execute this comand!`);
        const msgid = parseInt(args[0]);

        if (!msgid) return message.reply("Please specify a message id");

        let giveaway = client.GiveawayManager.giveaways.find((g) => g.messageId === args[0]);

        if (!giveaway) {
            return message.reply("Unable to find a giveaway for `" + args[0] + "`.");
        }

        client.GiveawayManager.reroll(giveaway.messageId, { winnerCount: isNaN(args[1]) ? Number(args[1]) : 1})
        .catch((e) => {
            if (e.startsWith(`Giveaway with message Id 1028586611069427753 is not ended.`)) {
                message.reply({ content : "This giveaway is not ended yet!" });
            } else {
                console.error(e);
                message.reply({ content : "An error occured..." });
            }
        });
    }
}