const { model, Schema } = require('mongoose');

let countingSchema = new Schema({
    Guild: String,
    Channel: String,
    Count: Number,
    LastPerson: String
});

module.exports = model('Counting', countingSchema);