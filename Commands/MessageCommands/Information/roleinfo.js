const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "roleinfo",
    category: "Information",
    aliases: ["ri"],
    description: "To Get Information About Role",
    run: async (message, args, client, prefix) => {

        let role = message.mentions.roles.first();

        if (!role) {
            role = message.guild.roles.cache.get(args[0]) || message.guild.roles.fetch(args[0]);
        }

        if (!role) {
            return message.reply({embeds: [new EmbedBuilder().setColor(client.color).setDescription(`${client.emoji.cross} | You didn't provided a valid role.`)]})
        }

        let color = role.color == 0 ? '#000000' : role.color;
        let created = `<t:${Math.round(role.createdTimestamp/1000)}:R>`;
        const embed = new EmbedBuilder()
        .setAuthor({  name: `${role.name}'s Information`, iconURL: client.user.displayAvatarURL() })
        .addFields([
            { name: `General Info`, value: `Role Name: **${role.name}**\nRole Id: \`${role.id}\`\nRole Position: **${role.rawPosition}**\nHex Code: \`${color}\`\nCreated At: ${created}\nMentionability: ${role.mentionable}\nIntegration: ${role.managed}`},
            { name: `Allowed Permissions`, value: `${role.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p => `\`${p}\``).join(", ")}` }
        ])
        .setColor(color)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        message.reply({embeds: [embed]})
    }
}