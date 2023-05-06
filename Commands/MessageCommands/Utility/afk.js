const { EmbedBuilder } = require("discord.js");
const afk = require("../../../Database/afk");

module.exports = {
    name: "afk",
    category: "Utility",
    aliases: ["awayfromkeyboard"],
    usage: "afk [reason]",
    description: "Set your status to AFK",
    run: async (message, args, client, prefix) => {
        const reason = args.join("") ? args.join(" ") : "No Reason Provided";
        const data = await afk.findOne({ Guild: message.guild.id, Member: message.author.id  });
        if (!data) {
            const newafk = new afk({
                Guild: message.guild.id,
                Member: message.author.id,
                Reason: reason,
                Time: Date.now(),
            });
            newafk.save();
            const embed = new EmbedBuilder()
            .setDescription(`**${message.author.username}#${message.author.discriminator}**, I Added You To My AFK List`)
            .addFields(
                { name: "Note:-", value: `Note: If You Wanna Be In AFK Mode And Type A Message Just Add \`[AFK]\` In The Starting Of Message, And If Want To Disable Afk Mode Type Anything Without AFK Tag` }
            )
                .setColor("Random");
            return message.reply({ embeds: [embed] });
        } else {
            return
        }
    }
};