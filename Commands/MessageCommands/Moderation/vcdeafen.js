const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "vcdeafen",
    category: "Moderation",
    description: "Deafens a user in your vc.",
    aliases: ["deafen", "voicedeafen"],
    usage: "!vcdeafen <mention>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            const error = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`You must have \`Deafen members\` permission to use this command.`)
            return message.reply({embeds: [error]});
        }
    
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            const error = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`I must have \`Deafen members\` permission to use this command.`)
            return message.reply({embeds: [error]});
        }
    
        let member = message.mentions.members.first();
    
        if (!member) {
            if (args[0]) {
                member = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            }
        }
        
        if (!member) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must mention someone whom you want to deafen in your vc.`)]})
        }
    
        if (!message.member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must be connected to a voice channel first.`)]})
        }
    
        
    
        if (!member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
        }

        if (member.voice.serverDeaf) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already deafened.`)

            return message.reply({ embeds: [embed] })
        }
    
        try {
            member.voice.setDeaf(true, `Voice Deafen Command Ran By ${message.author.tag} (${message.author.id})`)
            message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully deafened <@${member.user.id}> From Voice!`)]})
        } catch(e) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice deafen <@${member.user.id}>.`)]})
        }
    }
}