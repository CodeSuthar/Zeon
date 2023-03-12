const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ban",
    category: "Moderation",
    description: "Ban a user from a guild",
    usage: "!ban <mention a user>",
    run: async (message, args, client, prefix) => {

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply(`Hey Buddy, I need \`Ban Members Or Administrator\` permissions to execute this command!`);

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply(`Hey Buddy, You need \`Ban Members Or Administrator\` permissions to execute this comand!`);

        let enemy = message.mentions.members.first();

        if (!enemy) {
            if (args[0]) {
                enemy = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            };
        };
    
        const allegation = args.slice(1).join(" ") || "No reason provided!";
    
        if (!enemy) {
            const errorembed = new EmbedBuilder()
            .setDescription("You Need To Mention A Member To Ban")
            .setColor("Random")
            return message.reply({ embeds: [errorembed] })
        }
    
        if (enemy.id === message.guild.ownerId) {
          const errorembed = new EmbedBuilder()
          .setDescription("Dumb, You Can't Ban The Owner Of This Guild")
          .setColor("Random")
          return message.reply({ embeds: [errorembed] })
        }
    
        if (enemy.id === message.author.id) {
          const errorembed = new EmbedBuilder()
          .setDescription("Dumb, You Can't Ban Yourself")
          .setColor("Random")
          return message.reply({ embeds: [errorembed] })
        }
    
        if (message.member.roles.highest.position < enemy.roles.highest.position) {
            if (message.author.id = message.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Banned An Member From The Server`)
                .setDescription(`${enemy} Has Been Banned`)
                .addFields(
                    { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                    { name: `Banned By:`, value: `\`\`\`${message.author.tag}\`\`\`` }
                )
                .setColor("Random")
        
                return message.guild.bans.create(enemy, {
                    reason: allegation
                }).then(() => {
                    message.reply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Ban A Person Higher Than Or Equal Your Role")
                .setColor("Random")
                return message.reply({ embeds: [errorembed] })
            }
        }
    
        if (message.member.roles.highest.position = enemy.roles.highest.position) {
            if(message.author.id = message.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Banned An Member From The Server`)
                .setDescription(`${enemy} Has Been Banned`)
                .addFields(
                    { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                    { name: `Banned By:`, value: `\`\`\`${message.author.tag}\`\`\`` }
                )
                .setColor("Random")
            
                return message.guild.bans.create(enemy, {
                    reason: allegation
                }).then(() => {
                    message.reply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Ban A Person Higher Than Or Equal To Your Role")
                .setColor("Random")
                return message.reply({ embeds: [errorembed] })
            }
        }

        if (!enemy.bannable) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, I Can't Ban This Person Due To Missing Permission Or The User Has Higher Role Than Me")
            .setColor("Random")
            return message.reply({ embeds: [errorembed] })
        }
    
        const errorembed = new EmbedBuilder()
        .setTitle(`Banned An Member From The Server`)
        .setDescription(`${enemy} Has Been Banned`)
        .addFields(
            { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
            { name: `Banned By:`, value: `\`\`\`${message.author.tag}\`\`\`` }
        )
        .setColor("Random")
        
        return message.guild.bans.create(enemy, {
            reason: allegation
        }).then(() => {
            message.reply({ embeds: [errorembed] });
        });
    }
}