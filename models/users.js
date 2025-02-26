const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
