const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: "guildDelete",
  run: async (client, guild) => {

    const channel = client.channels.cache.get("1131170405827219466");
    let own = await guild?.fetchOwner()
    let text;
    guild.channels.cache.forEach(c => {
        if (c.type === 0 && !text) text = c;
    });
    let invite = await text.createInvite({ reason: `For ${client.user.tag} Developer(s) Leave Server Log's`, temporary: false, maxAge: 0 }).catch(err => {
        return message.channel.send(`${err} has occured!`);
    });
    const embed = new EmbedBuilder()
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setTitle(`📤 Left a Guild !!`)
      .addFields([
        { name: 'Name', value: `\`${guild.name}\`` },
        { name: 'ID', value: `\`${guild.id}\`` },
        { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.username : "Unknown user"}\` ${own.id}` },
        { name: 'Member Count', value: `\`${guild.memberCount}\` Members` },
        { name: 'Creation Date', value: `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\`` },
        { name: 'Guild Invite', value: `[Here is ${guild.name} invite](https://discord.gg/${invite.code})` },
        { name: `${client.user.username}'s Server Count`, value: `\`${client.guilds.cache.size}\` Servers` }
      ])
      .setColor(client.embedColor)
      .setTimestamp()
      channel.send({ embeds: [embed] });
  }
}