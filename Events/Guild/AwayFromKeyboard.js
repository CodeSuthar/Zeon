const { EmbedBuilder, InteractionCollector } = require("discord.js");
const db = require("../../Database/afk");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (!message.guild || !message.channel || !message.id || message.author.bot) return;
        let afk = await db.findOne({ Guild: message.guild.id, Member: message.author.id });

        if (afk) {
            if (message.content.startsWith(`[AFK]`)) return;

            await message.member.setNickname(afk.Nickname).catch(e => {});
            
            message.reply(`Welcome Back! **${message.author.username}#${message.author.discriminator}**, I Removed You From My AFK List, You Were AFK For **${convertTime(Date.now() - afk.Time)}**`)
            db.deleteMany({ Guild: message.guild.id, Member: message.author.id }).then(() => {
                console.log(`AFK Ended`)
            });
        } else {
            for(const user of [...message.mentions.users.values()]) {
                afk = await db.findOne({ Guild: message.guild.id, Member: user.id });

                if (afk) {
                    message.reply({ content: `**${user.username}#${user.discriminator}** Is On AFK Since **${convertTime(Date.now() - afk.Time)}**, With Reason: **${afk.Reason}**` })
                }
            }
        }
    }
};

function convertTime(duration) {

    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    

    if (duration < 3600000) {
        if (duration < 60000) {
            return seconds + " Seconds";
        } else {
            return minutes + " Minutes " + "And " + seconds + " Seconds";
        }
    } else {
        return hours + " Hour, " + minutes + " Minutes " + "And " + seconds + " Seconds";
    }
};