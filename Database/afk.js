const { Schema, model } = require('mongoose');

let AFK = new Schema({
    Guild: String,
    Member: String,
    Time: Number,
    Reason: String,
})

module.exports = model('afk', AFK);