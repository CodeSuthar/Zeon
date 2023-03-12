const { ShardingManager } = require("discord.js");
const { Bot } = require("./config.js")

const manager = new ShardingManager('./Zeon.js', {
    totalShards : "auto",
    shardList : "auto",
    token : Bot.Token
});

manager.on("shardCreate", async (shard) => {
    console.log(`[ ℹ️ Info ] Shard #${shard.id} Created!`)
});

manager.spawn({ timeout: -1 })