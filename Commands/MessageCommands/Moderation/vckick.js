const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "vckick",
    category: "Moderation",
    description: "Kicks a user in your vc.",
    aliases: ["voicekick"],
    usage: "!vckick <mention>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)){
            const error = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`You must have \`Move members\` permission to use this command.`)
            return message.reply({embeds: [error]});
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            const error = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`I must have \`Move members\` permission to use this command.`)
            return message.reply({embeds: [error]});
        }
    
        let member = message.mentions.members.first();
    
        if (!member) {
            if (args[0]) {
                member = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            }
        }
        
        if (!member) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must mention someone whom you want to kick from your vc.`)]})
        }
    
        if (!message.member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`You must be connected to a voice channel first.`)]})
        }
    
        
        
        if (!member.voice.channel) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`<@${member.user.id}> is not in your vc.`)]})
        }
    
        try {
            member.voice.disconnect();
            message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`${client.emoji.tick} | Successfully Kicked <@${member.user.id}> From Voice!`)]});
        } catch(e) {
            return message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`I was unable to voice kick <@${member.user.id}>.`)]});
        }
    }
}