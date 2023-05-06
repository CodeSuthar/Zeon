const { EmbedBuilder } = require('discord.js');
const UserSchema = require("../../../Database/user.js");

module.exports = {
    name: "profile",
    category: "Information",
    aliases: ["p"],
    description: "Shows your profile",
    run: async (message, args, client, prefix) => {
        let member = message.mentions.members.first();

        if (!member) {
            if (args[0]) {
                member = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            } else {
                member = message.member;
            }
        }

        if (!member) return message.channel.send("Please provide a user to show his/her profile.");

        let data = await UserSchema.findOne({ UserId: member.id });

        if (!data) {
            const newUser = new UserSchema({
              UserId: member.id,
            });

            await newUser.save();

            data = await UserSchema.findOne({ UserId: member.id });
        }

        let badge;

        if (data && data.badges) {
            badge = data.badges.join("\n");
            if (!badge || !badge.length) badge = `\`None\``;
        } else {
            badge = `\`None\``;
        }

        const embed = new EmbedBuilder()
        .setTitle("Profile")
        .setDescription(`User: **${member.user.tag}**`)
        .addFields({ name: "Badges", value: badge })
        .setColor("Random");

        return message.reply({ embeds: [embed] });

    }
};