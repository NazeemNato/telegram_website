const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
  },
  background: {
    type: String,
    default: "#ffffff",
  },
  body_text: {
    type: String,
    default: "Hola 👋",
  },
  meta: {
    type: String,
    default: "Create a simple single page website with the telegram bot builder. Choose a customizable background color and body content."
  },
  datetime: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("User", UserSchema);
