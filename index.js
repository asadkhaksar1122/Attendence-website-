const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
var session = require("express-session");
var flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Student } = require("./Schema/student");
const homeroute = require("./route/home");
const attendaceroute=require("./route/attendence")
const settingroute=require("./route/setting")
const adminroute=require("./route/admin")
const engine = require("ejs-mate");
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "my super duber secret key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/student");
}
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user;
  next();
});

app.use("/", homeroute);
app.use("/",attendaceroute)
app.use("/admin",adminroute)
app.use("/setting",settingroute)

app.use((error, req, res, next) => {
  let statusCode = error.status || 500;
  let message = error.message || "Internal Server Error";
  res.status(statusCode).send(message);
});
// Define a route to handle all requests
app.all("*", (req, res, next) => {
  next(new Error("Page not found", 404));
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(error.message);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
