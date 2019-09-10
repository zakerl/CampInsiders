var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground")

//root route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/results", function(req, res){
  if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      Campground.find({name: regex}, function(err, foundCampgrounds){
        if(err){
          console.log(err)
          req.flash("err",err.message)
          res.redirect("/campgrounds")
        }
        else{
          res.render("campgrounds/foundCampgrounds", {campgrounds:foundCampgrounds})
        }
    })
  }
  else{
    Campground.find({}, function(err, foundCampgrounds){
      if(err){
        console.log(err)
      }
      else{
        res.render("./campgrounds/index",{campgrounds: foundCampgrounds})
      }
    })
  }
})
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success', 'You\'ve successfully logged in!');
    res.redirect('/campgrounds');
  }
);


// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;