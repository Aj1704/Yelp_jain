var express= require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


//root route
router.get("/",function(req,res){
    //get all campground from db

    res.render("landing");
});




//show register form
router.get("/register",function(req,res){
    res.render("register",{page: 'register'});
});

//handle sign uplogic
router.post("/register",function(req,res){
    // res.send("Sign up.....");
    var newUser=new User({
        username:req.body.username,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        avatar:req.body.avatar
    });
    

    if(req.body.adminCode==='secretcode1999'){
        newUser.isAdmin=true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});


// show login form
router.get("/login",function(req,res){
    res.render("login",{page:'login'});
});

// handling login logic
router.post("/login",passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}) ,function(req,res){
    // res.send("login logic");


});

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});




//User Profile
// router.get("/users/:id",function(req,res){
//     User.findById(req.param.id,function(err,foundUser){
//         if(err){
//             req.flash(err,"Something went wrong");
//             res.redirect("/");
//         }
//         res.render("users/show",{user:foundUser});
//     });
// });

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




module.exports=router;