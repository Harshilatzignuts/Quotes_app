const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    quotes: [
      {
        type: String,
      },
    ],
  },
  { collection: "user-data" }
);

const model = mongoose.model("User", userSchema);

module.exports = model;
