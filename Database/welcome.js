const { Schema, model } = require('mongoose');

let Welcome = new Schema({
    Guild: String,
    Channel: String,
    Embed: Boolean,
    Button: Boolean,
    Description: String,
})

module.exports = model('welc', Welcome);