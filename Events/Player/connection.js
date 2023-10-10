module.exports = {
    name: "connection",
    run: async (client, queue) => {
        console.log(`[Player] - Joined ${queue.channel.name}(${queue.channel.id}) In ${queue.channel.guild.name}(${queue.channel.guildId}) Guild`)
    }
}