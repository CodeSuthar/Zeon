const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "vclist",
    category: "Moderation",
    description: "Deafens a user in your vc.",
    aliases: ["voicelist", "vcmembers"],
    usage: "!voicelist",
    run: async (message, args, client, prefix) => {
        if (!message.member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must be connected to a voice channel first.`)]})
        }

        let members = message.guild.members.cache.filter(m => m.voice?.channel?.id == message.member?.voice?.channel?.id).map(m => `${m.user.tag} | <@${m.user.id}>`).join(`\n`)
        
        return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(members).setTitle(`**Users in ${message.member.voice.channel.name} - ${message.member.voice.channel.members.size}**`)]})
    }
}