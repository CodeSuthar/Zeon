const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "vcundeafen",
    category: "Moderation",
    description: "Undeafens a user in your vc.",
    aliases: ["undeafen", "voiceundeafen"],
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
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must mention someone whom you want to undeafen in your vc.`)]})
        }

        if (!message.member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must be connected to a voice channel first.`)]})
        }
    
        
    
        if (!member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
        }

        if (!member.voice.serverDeaf) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already undeafened.`)

            return message.reply({ embeds: [embed] })
        }
    
        try {
            member.voice.setDeaf(false, `Voice Undeafen Command Ran By ${message.author.tag} (${message.author.id})`)
            message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully undeafened <@${member.user.id}> From Voice!`)]})
        } catch(err) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice undeafen <@${member.user.id}>.`)]})
        }
    }
}