const express = require("express");
const { islogin } = require("../middleware/middleware");
const { Attendence } = require("../Schema/attendence");
const router = express.Router();
const nodemailer = require("nodemailer");
const { Student } = require("../Schema/student");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "asadkhaksar1122@outlook.com",
    pass:process.env.PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});
router.get("/markattend", islogin, async (req, res) => {
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
  let studentattendence = await Attendence.find({
      $and:[
          { student: req.user._id },
          {
              date: {
                  $gte: startOfDay,
                  $lt: endOfDay,
              }
          }
   ]
  });
    console.log(studentattendence);
    if (studentattendence.length) {
        if (studentattendence[0].attendence=="present") {
          req.flash("error", "You have been already marked as present");
        } else if (studentattendence[0].attendence == "leave") {
          req.flash("error", "You have been already marked as leave");
        }
         return res.redirect("/");    
    }
    else {
      let newattendance = new Attendence({
          student: req.user._id,
          attendence: "present",
      })
        let attendence = await newattendance.save()
        req.flash("success","You have been marked as present")
      console.log(attendence)
      res.redirect("/");
    }

 
});
router.get('/leave', islogin, async (req, res) => {
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
  let todayattendence = await Attendence.find({
    $and: [
      { student: req.user._id },
      {
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    ],
  });
if (todayattendence) {
 if (todayattendence[0].attendence=="present") {
  req.flash("error","You have already present")
  return res.redirect("/")
  }
  else if (todayattendence[0].attendence=="leave") {
     req.flash("error", "You have been already marked as leave");
     return res.redirect("/");
  }
}
 let mailOptions = {
   from: "asadkhaksar1122@outlook.com",
   to: "asadkhaksar1122@gmail.com",
   subject: "Request Leave",
   html: `
        <p>${
          req.user.name
        } has requested for leave for approving click below button if want to reject just ignore the email</p>
        <a href="${req.protocol}://${req.get(
     "host"
   )}/leave/${req.user._id}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Approve Leave</a>
    `,
 };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    req.flash("success","Your request has been send to admin")
    res.redirect("/")
})
router.get('/leave/:id',islogin, async(req, res) => {
    let { id } = req.params;
    let student = await Student.findById(id);
    if (student) {
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
         let studentattendence = await Attendence.find({
           $and: [
             { student: student._id },
             {
               date: {
                 $gte: startOfDay,
                 $lt: endOfDay,
               },
             },
           ],
         });
        if (studentattendence.length) { 
            if (studentattendence[0].attendence == "present") { 
             res.send("the student is already decleared present")
            }
        }
        else {
             let newattendance = new Attendence({
               student: student._id,
               attendence: "leave",
             });
             let attendence = await newattendance.save();
             req.flash("success", "The student marked as on leave");
             console.log(attendence);
             res.redirect("/");
        }
    } else {
        req.flash("error", "Student not found");
        res.redirect("/")
    }
})

router.get('/allviews',islogin, async (req, res) => {
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
    let attendences = await Attendence.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).populate("student");
    console.log(attendences)
    res.render("routerejs/todayattendence.ejs", { attendences });
})
module.exports = router;
