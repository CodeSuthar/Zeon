const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("../../../Database/prefix.js");

//SetPrefix By BrBlacky

module.exports = {
    name: "setprefix",
    category: "Configuration",
    description: "Set Custom Prefix",
    usage: "setprefix <prefix to set>",
    aliases: ["prefix"],
    voteReq: true,
    run: async (message, args, client, prefix) => {
    
        const data = await db.findOne({ Guild: message.guildId });
        const pre = await args[0];
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`MANAGE_GUILD Or ADMINISTRATOR\` permissions to execute this command!`);
        if (!pre) {
        const embed = new EmbedBuilder()
            .setDescription("Please give the prefix that you want to set!")
            .setColor("Random")
            return message.reply({ embeds: [embed] });
        }
    
        if (pre.length > 5) {
            const embed = new EmbedBuilder()
            .setDescription("You can not send prefix more than 5 characters")
            .setColor("Random")
            return message.reply({ embeds: [embed] });
        }
    
        if (data) {
            data.Prefix = pre;
            await data.save()
            const update = new EmbedBuilder()
            .setDescription(`Your prefix has been updated to **${pre}**`)
            .setColor("Random")
            return message.reply({embeds: [update]});
        } else {
            const newData = new db({
                Guild: message.guildId,
                Prefix: pre
            });
            await newData.save()
            const embed = new EmbedBuilder()
            .setDescription(`Custom prefix in this server is now set to **${pre}**`)
            .setColor("Random")
            return message.reply({embeds: [embed]});
        }
    }
};