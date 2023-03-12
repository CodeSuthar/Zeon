const { EmbedBuilder } = require('discord.js');
const { post } = require('node-superfetch');

module.exports = {
    name: 'leave',
    category: 'Developer',
    aliases: ['lv'],
    description: 'Leave server',
    developer: true,
    run: async (message, args, client, prefix) => {
        let guild = client.guilds.cache.get(args[0]);
        if (!guild) return message.reply({ content: 'Could not find the Guild to Leave' });
        guild.leave().then((g) => {
            message.reply({
                content: `Left \`${g.name} | ${g.id}\``,
            });
        })
        .catch((e) => {
            message.reply(`${e.message ? e.message : e}`, {
                code: 'js',
            });
        });
    },
};