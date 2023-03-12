module.exports = {
    name: 'shardReconnecting',
    run: async (client, id) => {
        console.log(`[ ⚠️ Warn ] Shard #${id} Reconnecting`);
    }
};