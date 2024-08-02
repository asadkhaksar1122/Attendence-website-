const express = require("express");
const { Student } = require("../Schema/student");
const { Attendence } = require("../Schema/attendence");
const { islogin, isadmin } = require("../middleware/middleware");
const router = express.Router();
router.get("/",islogin,isadmin, (req, res) => {
  res.render("routerejs/admin.ejs");
});
router.get("/absent",islogin,isadmin, async (req, res) => {
  const currentDay = new Date();
  const startOfDay = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate()
  );
  const endOfDay = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate() + 1
  );
  let allstudent = await Student.find({});
  let todayattendence = await Attendence.find({
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });
  let studentid = todayattendence.map((element) => {
    return element.student.toString(); // Convert student ID to string
  });
  let remainingstudent = allstudent.filter((element) => {
    console.log(element._id);
    return !studentid.includes(element._id.toString());
  });
  for (const remainstudent of remainingstudent) {
    let newattendance = new Attendence({
      student: remainstudent._id,
      attendence: "absent",
    });
    savedattendence = await newattendance.save();
    console.log(savedattendence);
  }
  req.flash("success", "The remaining student has been declared Absent");
  res.redirect("/admin");
});
router.get("/attendence",islogin,isadmin, async (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const monthattendence = await Attendence.find({
    date: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1),
    },
  }).populate("student");
  console.log(monthattendence);
  res.render("routerejs/monthattendence.ejs", { attendences: monthattendence });
});
router.get("/viewabsent",islogin,isadmin, async (req, res) => {
  const currentDay = new Date();
  const startOfDay = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate()
  );
  const endOfDay = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate() + 1
  );

  let todayabsent = await Attendence.find({
    $and: [
      {
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      { attendence: "absent" },
    ],
  }).populate("student");
    console.log(todayabsent)
    res.render("routerejs/todayabsent.ejs",{todayabsent})
});
module.exports = router;
