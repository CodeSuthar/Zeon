const Zeon = require("./Structures/Client.js");

const client = new Zeon();

client.build();

client.deploy();

module.exports = client;