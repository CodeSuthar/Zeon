module.exports = {
    name: "error",
    run: async (client, queue, error) => {
        console.log(`[Error] - ${error}`)
    }
}