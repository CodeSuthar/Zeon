const mongoose = require("mongoose");
const LinkMongoDB = mongoose.connect;
const MongoDBStatus = mongoose.connection;

module.exports = async (client) => {
    LinkMongoDB(client.config.MongoConnectorURL, MongoConnectorOption())
    MongoDBStatus.on('connected', () => {
        console.log("[ DB LOG ] " + 'DATABASE CONNECTED');
    });
    MongoDBStatus.on('err', (err) => {
       console.log("[ DB LOG ] " + `Mongoose connection error: \n ${err.stack}` );
    });
    MongoDBStatus.on('disconnected', () => {
        console.log("[ DB LOG ] " + 'Mongoose disconnected');
    });

    const { Database } = require('quickmongo');
    const db = new Database(client.config.MongoConnectorURL);
    db.connect().then(() => {
        console.log("[ DB LOG ] " + 'SECOND DATABASE CONNECTED');
        client.db = db;
    });
}

function MongoConnectorOption() {
    return {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        useUnifiedTopology: true,
    }
}