const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "membercount",
    description: "Shows the member count of the server",
    aliases: ["members", "mc"],
    category: "Information",
    usage: "membercount",
    run: async (message, args, client, prefix) => {
        const embed = new EmbedBuilder()
        .setDescription(`Members`)
        .setDescription(`**Members**\n${message.guild.memberCount}`)
        .setColor("Random")
        .setTimestamp()
        message.reply({ embeds: [embed] });
    }
}