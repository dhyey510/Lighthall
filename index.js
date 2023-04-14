const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const nodeGeocoder = require("node-geocoder");
const methodOverride = require("method-override");
const dataModel = require("./models/dataModel");
const dotenv = require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.vmsu9lg.mongodb.net/test`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let options = {
  provider: "openstreetmap",
};

let geoCoder = nodeGeocoder(options);

app.get("/", async (req, res) => {
  const data = await dataModel.findOne({});
  if (data) {
    res.render("index.ejs", { data, locations: data.locations });
  } else {
    var newData = new dataModel({
      totalCount: 0,
      locations: [],
    });
    newData
      .save()
      .then((d) => {
        console.log("Create Default one!!");
        res.render("index.ejs", { data: d, locations: d.locations });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.put("/increament", async (req, res) => {
  const oldData = await dataModel.findOne({});

  navigator.geolocation.getCurrentPosition((success, err) => {
    geoCoder
      .reverse({ lat: success.latitude, lon: success.longitude })
      .then((response) => {
        console.log(response[0]);
        var flag = false;
        for (let loc of oldData.locations) {
          if (
            loc.city === response[0].city &&
            loc.country === response[0].country
          ) {
            loc.clicks += 1;
            flag = true;
          }
        }
        if (!flag) {
          oldData.locations.push({
            city: response[0].city,
            country: response[0].country,
            clicks: 1,
          });
          console.log(oldData.locations);
        }

        oldData.totalCount += 1;

        oldData
          .save()
          .then((d) => {
            console.log("success");
          })
          .catch((err) => {
            console.log(err);
          });

        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Started On Port No ${port}`);
});
