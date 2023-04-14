const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const nodeGeocoder = require("node-geocoder");
const methodOverride = require("method-override");
const dataModel = require("./models/dataModel");
const dotenv = require("dotenv").config();

//set view engine as ejs and set dynamic path for view folder in which all ejs files are there
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//use middleware for express and set public directory for static files such as css, js
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
//to override form submit method from POST to PUT
app.use(methodOverride("_method"));

let options = {
  provider: "openstreetmap",
};

let geoCoder = nodeGeocoder(options);

/**
 * home route - "/"
 **/

app.get("/", async (req, res) => {
  const data = await dataModel.findOne({});

  //if there is no data inside database then it will create default one
  if (data) {
    res.render("app.ejs", { data, locations: data.locations });
  } else {
    var newData = new dataModel({
      totalCount: 0,
      locations: [],
    });
    newData
      .save()
      .then((d) => {
        res.render("app.ejs", { data: d, locations: d.locations });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

/**
 * Put route to update model in database - "/increament"
 */

app.put("/increament", async (req, res) => {
  const oldData = await dataModel.findOne({});

  //use geocoder to convert lat, long into location
  geoCoder
    .reverse({ lat: req.body.lat, lon: req.body.long })
    .then((response) => {
      //first check if specific city already there in database then it just update it's count
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
      }

      oldData.totalCount += 1;

      oldData
        .save()
        .then((d) => {
          console.log("success");
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((e) => {
      console.log(e);
    });
});

//connecting mongoose with mongoDB
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

// use process enviornment port to start HTTP server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Started On Port No ${port}`);
});
