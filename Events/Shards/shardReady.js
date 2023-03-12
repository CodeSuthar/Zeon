module.exports = {
    name: 'shardReady',
    run: async (client, id) => {
        console.log(`[ ℹ️ Info ] Shard #${id} Ready!`);
    }
};