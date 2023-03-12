const { model, Schema } = require("mongoose");

const userSchema = Schema({
  UserId: {
    type: String,
    required: true,
    unique: true,
  },
  badges: {
    type: Array,
    default: [],
  },
});

module.exports = model("User", userSchema);