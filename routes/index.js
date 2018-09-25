var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//root route
router.get("/", function(req,res){
    res.render("landing");
});
//Auth Route
router.get("/register",function(req, res) {
    res.render("register",{page: 'register'});
});

//Handle Sign up
router.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
             console.log(err);
             return res.render("register", {error: err.message});
            }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Successfully Registered " + user.username);
            res.redirect("campgrounds");
        });
    });
});

//show login form
router.get("/login",function(req,res){
    res.render("login",{page:'login'});
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
    })(req, res);
});
//logout route

router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Successfully Logged Out!");
    res.redirect("/campgrounds");
});

module.exports = router;