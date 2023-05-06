const { PermissionsBitField } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "gend",
    category: "Giveaway",   
    description: "To end A Giveaway",
    usage: "gend <message id>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`Manage Server Or Administrator\` permissions to execute this comand!`);
        const msgid = parseInt(args[0]);

        if (!msgid) return message.reply("Please specify a message id");

        let giveaway = client.GiveawayManager.giveaways.find((g) => g.messageId === args[0]);

        if (!giveaway) {
            return message.reply("Unable to find a giveaway for `" + args[0] + "`.");
        }

        client.GiveawayManager.edit(giveaway.messageId, {
            setEndTimestamp: Date.now()
        })
        .then(() => {
            message.reply({ content : "Giveaway will end in less then 10 Seconds!" });
        })
        .catch((e) => {
            if (e.startsWith(`Giveaway with message Id ${giveaway.messageId} is already ended.`)) {
                message.reply({ content : "This giveaway is already ended!" });
            } else {
                console.error(e);
                message.reply({ content : "An error occured..." });
            }
        });
    }
}