const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  totalCount: Number,
  locations: [
    {
      city: String,
      country: String,
      clicks: Number,
    },
  ],
});

const dataModel = mongoose.model("dataModel", dataSchema);

module.exports = dataModel;
