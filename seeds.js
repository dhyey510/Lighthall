const mongoose = require("mongoose");
const dataModel = require("./models/dataModel");

mongoose
  .connect("mongodb+srv://dhyey870:Dhyey510@cluster0.vmsu9lg.mongodb.net/test")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

var data = new dataModel({
  totalCount: 0,
  locations: [],
});

data
  .save()
  .then((d) => {
    console.log(d);
  })
  .catch((err) => {
    console.log(err);
  });
