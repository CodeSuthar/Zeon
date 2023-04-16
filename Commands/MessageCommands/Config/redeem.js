const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const GuildDB = require("../../../Database/premium");
const Code = require("../../../Database/premium-code")

module.exports = {
    name: "redeem",
    category: "Configuration",
    description: "To redeem premium",
    usage: "setprefix <prefix to set>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`MANAGE_GUILD Or ADMINISTRATOR\` permissions to execute this command!`);

        const code = args[0];
        let Guild = await GuildDB.findOne({_id: message.guild.id});

        if (!code) return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(`Random`)
                .setDescription(`${client.emoji.wrong} | Please specify the code you want to redeem`),
            ],
        });

        let Pcode = await Code.findOne({
            code: code
        });

        if(!Pcode) { 
            return message.reply({ embeds: [
                new EmbedBuilder()
                .setColor(`#ff0080`)
                .setDescription(`${client.emoji.wrong} | The code you provided is invalid!`),
            ]});
        };

        if (Pcode && Guild) {
            Guild.expireTime = Guild.expireTime + Pcode.times;
            let time = Guild.expireTime.toString().split("");
            time.pop();
            time.pop();
            time.pop();
            time = time.join("");

            Guild.isPremium = true
            Guild.redeemedBy = message.author.id
            Guild.redeemedAt = Date.now()
            Guild.plan = Pcode.plan,
            Guild.expireAt = Guild.expireTime,
            Guild.expireTime = Guild.expireTime

            Guild = await Guild.save({ new: true });

            const usetime = Pcode.uses - 1;

            const plan = Pcode.plan;
            
            if (usetime === 0 || !usetime) {
                await Pcode.deleteOne();
            } else {
                Pcode.uses = Pcode.uses - 1

                Pcode = await Pcode.save({ new: true });
            }

            let userembed = new EmbedBuilder()
            .setDescription(`${client.emoji.tick} | You have successfully redeemed premium for this guild\nRedeemed by - <@${message.author.id}>
            Plan - ${plan}\nExpires at: <t:${time}>(<t:${time}:R>)`)
            .setColor(`Random`)

            return message.reply({ embeds: [userembed] });
        } else if (Pcode && !Guild) {
            let time = Pcode.expireTime.toString().split("");
            time.pop();
            time.pop();
            time.pop();
            time = time.join("");

            await GuildDB.create({
                _id: message.guild.id,
                isPremium: true,
                redeemedBy : message.author.id,
                redeemedAt : Date.now(),
                plan: Pcode.plan,
                expireAt : Pcode.expireTime,
                expireTime: Pcode.expireTime
            });

            const usetime = Pcode.uses - 1;

            const plan = Pcode.plan;
            
            if (usetime === 0 || !usetime) {
                await Pcode.deleteOne();
            } else {
                Pcode.uses = Pcode.uses - 1

                Pcode = await Pcode.save({ new: true });
            }

            let userembed = new EmbedBuilder()
            .setDescription(`${client.emoji.tick} | You have successfully redeemed premium for this guild\nRedeemed by - <@${message.author.id}>
            Plan - ${plan}`)
            .setColor(`Random`)

            return message.reply({ embeds: [userembed] });
        }
    }
};