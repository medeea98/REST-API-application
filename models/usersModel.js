const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Passwrod is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
