function islogin(req,res,next) {
    if (req.user) {
      return  next()
    }
    else {
        req.flash("error","Please Log in or Register first")
        res.redirect("/login")
    }
}
function isadmin(req,res,next) {
  if (req.user.admin) {
     return next()
  } else {
    req.flash("error","You are not admin you can't access this")
    res.redirect("/")
  }
}
module.exports={islogin,isadmin}