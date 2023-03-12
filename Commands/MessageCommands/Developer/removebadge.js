const { EmbedBuilder } = require('discord.js');
const UserSchema = require("../../../Database/user.js");

module.exports = {
    name: 'removebage',
    category: 'Developer',
    aliases: ['removeb'],
    description: 'Leave server',
    developer: true,
    run: async (message, args, client, prefix) => {
        let member = message.mentions.members.first();

        if (!member) {
            if (args[0]) {
                member = message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]);
            } else {
                member = message.member;
            }
        }
      
        if (!member) return message.channel.send("Please provide a user to add a badge to him/her.");

        const badge = args.slice(1).join(" ");

        if (!badge) return message.channel.send("Please provide a badge to remove from the the user!");

        let data = await UserSchema.findOne({ UserId: member.id });

        if (!data) {
            const newUser = new UserSchema({
              UserId: member.id,
            });

            await newUser.save();

            data = await UserSchema.findOne({ UserId: member.id });
        }

        if (data.badges && !data.badges.includes(badge)) return message.reply(`The User Don't Have This Has This Badge, So I Cant Remove It It!`);

        data.badges.remove(badge);

        await data.save();

        const embed = new EmbedBuilder()
        .setTitle("Badge removed")
        .setDescription(`Removed the badge ${badge} from the user \`${member.user.tag}\`.`)
        .setColor("Random");

        return message.reply({ embeds: [embed] });
    },
};