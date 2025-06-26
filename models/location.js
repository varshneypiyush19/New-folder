const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  country: String,
  states: [
    {
      name: String,
      cities: [String],
    },
  ],
});

module.exports = mongoose.model("Location", locationSchema);
