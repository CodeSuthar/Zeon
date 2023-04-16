const { EmbedBuilder } = require("discord.js");
const DB = require("../../../Database/premium")

module.exports = {
    name: "removepremium",
    category: 'Developer',
    description: 'Removes A Guild From Premium',
    developer: true,
    run: async (message, args, client, prefix) => {
        let GuildId = args[0];
        let Guild;
        
        if (!GuildId) {
            Guild = message.guild;
        } else {
            Guild = client.guilds.cache.get(GuildId) || client.guilds.fetch(GuildId);
        }

        if (!Guild) {
            return message.reply(`${client.emoji.wrong} | The guild, You are talking about, I'm not connected to it in anyway.`)
        }

        const Data = await DB.findOne({ _id: Guild.id });

        if (!Data) {
            let userembed12 = new EmbedBuilder()
            .setDescription(
            `${client.emoji.wrong} | \`${Guild.name} - ${Guild.id}\` does not have any premium plan.`)
            .setColor(`Random`)
       
            return message.reply({ embeds: [userembed12] });
        }

        if (Data) {
            if (!Data.isPremium) {
                let embed = new EmbedBuilder()
                .setDescription(`${client.emoji.wrong} | \`${Guild.name} - ${Guild.id}\` does not have any premium plan.`)
                .setColor(`Random`)

                return message.reply ({ embeds: [embed] });
            } else {
                Data.deleteOne({ _id: Guild.id })

                let userembed = new EmbedBuilder()
                .setDescription(`${client.emoji.tick} | You have successfully removed premium from \`${Guild.name} - ${Guild.id}\`.`)
                .setColor(`Random`)

                return message.reply({ embeds: [userembed] });
            }
        }
    }
}