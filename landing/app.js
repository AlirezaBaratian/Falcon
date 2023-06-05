//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const persianDate = require("persian-date");

mongoose.connect("mongodb://localhost:27017/subnetvpn", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", {
  name: String,
  username: String,
  pin: String,
  date: String,
  duration: String,
});

const Registeration = mongoose.model("Registeration", {
  name: String,
  recommender: String,
  username: String,
  pin: String,
  contact: String,
});

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  res.send("index.html")
});

app.get("/putin", (req, res) => {
  res.render("putin");
});

app.get("/user", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  const newRegisteration = new Registeration({
    name: req.body.name,
    recommender: req.body.recommender,
    username: req.body.username,
    password: req.body.password,
    contact: req.body.contact,
  });
  newRegisteration
    .save()
    .then(() => {
      res.render("success");
    })
    .catch((err) => {
      console.log(err);
      res.render("failure");
    });
});

app.post("/putin", (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const date = req.body.date;
  const duration = req.body.duration;
  const pin = req.body.pin;
  var dateArray = [];

  date.split("/").forEach((dateElement) => {
    dateArray.push(parseInt(dateElement));
  });

  const registerDate = new persianDate(dateArray);
  const expirationDate = registerDate.add("months", duration);
  const outputExpirationDate = expirationDate
    .toLocale("fa")
    .format()
    .split(" ")[0]
    .replace(/-/g, "/");
  const remainingDays = expirationDate.diff(new persianDate(), "days");

  const user = new User({
    name: name,
    username: username,
    date: date,
    duration: duration,
    pin: pin,
  });
  user.save((err) => {
    if (err) {
      console.log(err);
      res.render("failure");
    } else {
      res.render("user", {
        name: name,
        username: username,
        pin: pin,
        date: date,
        expirationDate: outputExpirationDate,
        remainingDays: remainingDays,
      });
    }
  });
});

app.post("/user", (req, res) => {
  const username = req.body.username;
  const pin = req.body.pin;

  if (username === "thegreatadmin" && pin === "497108988922") {
    User.find({}, (err, foundDocuments) => {
      if (err) {
        console.log(err);
        res.send("Error!");
      } else {
        if (foundDocuments) {
          res.render("users-list", { users: foundDocuments });
        }
      }
    });
  } else {
    User.findOne({ username: username }, (err, foundUser) => {
      if (err) {
        console.log(err);
        res.render("no-user");
      } else {
        if (foundUser) {
          if (pin === foundUser.pin) {
            var dateArray = [];

            foundUser.date.split("/").forEach((dateElement) => {
              dateArray.push(parseInt(dateElement));
            });

            const registerDate = new persianDate(dateArray);
            const expirationDate = registerDate.add(
              "months",
              foundUser.duration
            );
            const outputExpirationDate = expirationDate
              .toLocale("fa")
              .format()
              .split(" ")[0]
              .replace(/-/g, "/");
            const remainingDays = expirationDate.diff(
              new persianDate(),
              "days"
            );

            res.render("user", {
              name: foundUser.name,
              username: foundUser.username,
              pin: foundUser.pin,
              date: foundUser.date,
              expirationDate: outputExpirationDate,
              remainingDays: remainingDays,
            });
          } else {
            res.render("wrong-password");
          }
        } else {
          res.render("no-user");
        }
      }
    });
  }
});

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + "/404.html");
});

const port = 3002;

app.listen(port, () => {
  console.log("Server is listenning on http://localhost:" + port);
});