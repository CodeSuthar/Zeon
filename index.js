const { ShardingManager } = require("discord.js");
const { existsSync, readFileSync } = require("fs");
const { Bot } = require("./config.js")

if (!existsSync("./Utils/ZeonLogo.txt")) {
    console.log("[ CLIENT ] An error has occurred : ZeonLogo.txt not found");
    process.exit(1);
}
  
try {
    const logFile = readFileSync("./Utils/ZeonLogo.txt", "utf-8");
    console.log('\x1b[38;2;6;11;29;255m%s\x1b[0m', logFile);
    console.log(`================================================================================================`)
    console.log(`[ CLIENT ] Starting Zeon...`)
} catch (e) {
    console.log("[ CLIENT ] An error has occurred : " + e);
}

const manager = new ShardingManager('./Zeon.js', {
    totalShards : "auto",
    shardList : "auto",
    token : Bot.Token
});

manager.on("shardCreate", async (shard) => {
    console.log(`[ ℹ️ Info ] Shard #${shard.id} Created!`)
});

manager.spawn({ timeout: -1 })

module.exports = manager;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}