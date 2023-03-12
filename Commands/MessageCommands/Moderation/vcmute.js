const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "vcmute",
    category: "Moderation",
    description: "Mutes a user in your vc.",
    aliases: ["voicemute"],
    usage: "!vcmute <mention>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            const error = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`You must have \`Mute members\` permission to use this command.`)
            return message.reply({embeds: [error]});
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            const error = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`I must have \`Mute members\` permission to use this command.`)
            return message.reply({embeds: [error]});
        }

        let member = message.mentions.members.first();
    
        if (!member) {
            if (args[0]) {
                member = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            }
        }
        
        if (!member) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must mention someone whom you want to mute in your vc.`)]})
        }
    
        if (!message.member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must be connected to a voice channel first.`)]})
        }
    
        
    
        if (!member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
        }

        if (member.voice.serverMute) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.emoji.wrong} | <@${member.user.id}> is already muted.`)

            return message.reply({ embeds: [embed] })
        }
    
        try {
            member.voice.setMute(true, `Voice Mute Command Ran By ${message.author.tag} (${message.author.id})`)
            message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully Muted <@${member.user.id}> From Voice!`)]})
        } catch(err) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice mute <@${member.user.id}>.`)]})
        }
    }
}