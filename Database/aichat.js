const { Schema, model} = require('mongoose');

let AiChat = new Schema({
  Guild : String,
  Channel: String
})

module.exports = model('aichat', AiChat);