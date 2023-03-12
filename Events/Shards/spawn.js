module.exports = {
    name: `spawn`,
    run: async (client) => {
        console.log('Spawned %d cluster', client.cluster.id);
    }
};