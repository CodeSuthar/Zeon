const { EmbedBuilder } = require('discord.js');
const { sendMessage } = require('../../Utils/Utils.js');

module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        // Guild Declarations
        const guild = member.guild;
        const guildId = guild.id;

        // Embed Design
        const emb = new EmbedBuilder()
        .setTitle('Member Joined!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${member.user.tag} has joined the server!`)
        .setFooter({ text: `ID: ${member.user.id} - Joined At` })
        .setTimestamp();

        // Returning The Embed For Logging
        return await sendMessage(guild, { embeds: [emb] }, "guildMemberLogs").catch((e) => {
            console.log(e);
        });
    }
}