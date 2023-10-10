const { model, Schema } = require("mongoose");

const musicDJSetup = new Schema({
    _id: {
        type: String,
        required: true
    },

    roles: {
        type: Array,
        default: null
    },

    mode: {
        type: Boolean,
        default: false
    },

    moderator: {
        type: String,
        required: true
    },

    lastUpdated: {
        type: String,
        default: Math.round(new Date().getDate/1000)
    }
});

module.exports = model("musicDJSetup", musicDJSetup);