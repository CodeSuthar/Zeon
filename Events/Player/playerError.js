module.exports = {
    name: "playerError",
    run: async (client, queue, error) => {
        console.log(`[ Player ] - Error - ${error}`)
    }
}