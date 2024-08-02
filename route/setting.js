const express=require("express");
const { Student } = require("../Schema/student");
const {islogin, isadmin}=require("../middleware/middleware")
const { Attendence } = require("../Schema/attendence");
const router = express.Router();
router.get('/',islogin,isadmin, (req, res) => {
    res.render("routerejs/setting.ejs")
})
router.get('/markleave',islogin,isadmin, (req, res) => {
    res.render("routerejs/markleave.ejs")
})
router.post('/markleave',islogin,isadmin, async(req, res) => {
    let { email } = req.body;
    let student= await Student.findOne({email:email})
    if (!student) { 
        req.flash("error","Student with this email not found")
        return res.redirect("/setting/markleave");
    }
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
         { student: student._id },
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
            req.flash("success","student has been already decleared as present")
            return res.redirect("/")
        }
       else if (todayattendence[0].attendence=="leave") {
            req.flash("success","student has been already decleared as leave")
            return res.redirect("/")
        }
        else {
            todayattendence[0].attendence = "leave";
            savedattendence = await todayattendence[0].save();
            console.log(savedattendence)
            req.flash("success","The student has been marked as leave")
            return res.redirect("/")
        }
    } else {
         let newattendance = new Attendence({
           student: student._id,
           attendence: "leave",
         });
         savedattendence = await newattendance.save();
         console.log(savedattendence);
    }
   
    res.redirect("/")
})
router.get('/admin',islogin,isadmin, (req, res) => {
    res.render("routerejs/makeadmin.ejs")
})
router.post('/admin', async (req, res) => {
  console.log(req.user)
    let { email } = req.body;
    let student = await Student.findOne({ email: email })
    if (!student) {
        req.flash("error","The email you enter not found")
        return res.redirect("/setting/admin")
    }
    if (student.admin) {
        req.flash("error","The person is already admin")
        return res.redirect("/")
  }
  student.admin = true;
  await student.save();
  req.flash("success","The person has become admin")
  res.redirect("/")
})
router.get('/seeadmin',islogin,isadmin, async(req, res) => {
  let admins =  await Student.find({ admin: true })
  console.log(admins)
res.render("routerejs/seeadmin.ejs",{admins})
})
module.exports = router;