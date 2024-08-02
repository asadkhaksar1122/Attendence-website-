const express = require("express");
const router = express.Router();
const passport=require("passport")
const {Student}=require("../Schema/student");
const { islogin } = require("../middleware/middleware");

 
router.get("/",islogin, (req, res) => {
  if (req.user && req.user.admin) {
    console.log(req.user.admin)
  }
  res.render("routerejs/home.ejs");
});

router.get("/register", (req, res) => {
  res.render("routerejs/register.ejs");
});
router.post('/register', (req, res) => {
  let {name, username, email, password } = req.body
  Student.register(new Student({name, username, email }), password, (err, user) => {
    if (err) {
      console.log(err)
      return res.render('routerejs/register.ejs', { err })
    }
    console.log(user)
    req.login(user, (error) => {
    if (error) {
     return console.log(error)
      }
      req.flash("success","YOu have sign up and login")
      res.redirect("/")
  })
    })
})
  router.get('/login', (req, res) => {
    res.render("routerejs/login.ejs")
  })
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login",failureFlash:true }),
  (req, res) => {
    req.flash("success","You have been successfully log in")
    res.redirect("/")
  }
);
router.get('/logout', (req, res) => {
  req.logout((error)=>{
    if(error){
       return console.log(error)
    }
    req.flash("error","You have been log out")
    res.redirect("/")
    console.log(new Date())
  })
})
module.exports = router;
