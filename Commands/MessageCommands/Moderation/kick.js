const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kick a user from a guild",
    usage: "!kick <mention a user>",
    run: async (message, args, client, prefix) => {

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply(`Hey Buddy, I need \`KICK_MEMBERS Or ADMINISTRATOR\` permissions to execute this command!`);

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply(`Hey Buddy, You need \`KICK_MEMBERS Or ADMINISTRATOR\` permissions to execute this comand!`);

        let enemy = message.mentions.members.first();

        if (!enemy) {
            if (args[0]) {
                enemy = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            };
        };
    
        const allegation = args.slice(1).join(" ") || "No reason provided!";
    
        if (!enemy) {
            const errorembed = new EmbedBuilder()
            .setDescription("You Need To Mention A Member To Kick")
            .setColor("Random")
            return message.reply({ embeds: [errorembed] })
        }
    
        if (enemy.id === message.guild.ownerId) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, You Can't Kick The Owner Of This Guild")
            .setColor("Random")
            return message.reply({ embeds: [errorembed] })
        }
    
        if (enemy.id === message.author.id) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, You Can't kick Yourself")
            .setColor("Random")
            return message.reply({ embeds: [errorembed] })
        }
    
        if (message.member.roles.highest.position < enemy.roles.highest.position) {
            if(message.member.id = message.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Kicked An Member From The Server`)
                .setDescription(`${enemy} Has Been Kicked`)
                .addFields(
                  { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                  { name: `Kicked By:`, value: `\`\`\`${message.author.tag}\`\`\`` }
                )
                .setColor("Random")
                
                return enemy.kick(allegation).then(() => {
                  message.reply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Kick A Person Higher Than Or Equal To Your Role")
                .setColor("Random")
                return message.reply({ embeds: [errorembed] })
            }
        }
    
        if (message.member.roles.highest.position = enemy.roles.highest.position) {
            if(message.member.id = message.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Kicked An Member From The Server`)
                .setDescription(`${enemy} Has Been Kicked`)
                .addFields(
                    { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                    { name: `Kicked By:`, value: `\`\`\`${message.author.tag}\`\`\`` }
                )
                .setColor("Random")
                
                return enemy.kick(allegation).then(() => {
                    message.reply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Kick A Person Higher Than Or Equal To Your Role")
                .setColor("Random")
                return message.reply({ embeds: [errorembed] })
            }
        }

        if (!enemy.kickable) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, I Can't Kick This Person Due To Missing Permission Or The User Has Higher Role Than Me")
            .setColor("Random")
            return message.reply({ embeds: [errorembed] })
        }
    
        const errorembed = new EmbedBuilder()
        .setTitle(`Kicked An Member From The Server`)
        .setDescription(`${enemy} Has Been Kicked`)
        .addFields(
          { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
          { name: `Kicked By:`, value: `\`\`\`${message.author.tag}\`\`\`` }
        )
        .setColor("Random")
    
        return enemy.kick(allegation).then(() => {
            message.reply({ embeds: [errorembed] });
        });
    }
}