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
  datetime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
