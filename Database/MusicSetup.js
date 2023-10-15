const { model, Schema } = require("mongoose");

const musicSetup = new Schema({
    _id: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    channel: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    voiceChannel: {
        type: String,
        required: false,
        default: null
    },

    moderator: {
        type: String,
        required: true
    },

    lastUpdated: {
        type: String,
        default: new Date().getDate()
    },

    logs: {
        type: Array,
        default: null
    }
});

module.exports = model("musicSetup", musicSetup);