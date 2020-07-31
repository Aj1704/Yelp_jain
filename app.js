

// const seedDB = require('./seeds');


var express=require('express'),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    flash=require("connect-flash"),
    passport= require("passport"),
    LocalStrategy= require("passport-local"),
    methodOverride=require("method-override"),
    Campground =require("./models/campground"),
    Comment= require("./models/comment"),
    User=require("./models/user"),
    SeedDB= require("./seeds");

//requiring routes
var commentRoutes= require("./routes/comments"),
campgroundRoutes= require("./routes/campgrounds"),
indexRoutes = require("./routes/index");

    mongoose.connect('mongodb://localhost:27017/yelp_camp11', {useNewUrlParser: true, useUnifiedTopology: true});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
// seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "Rusty you are mc",
    resave: false,
    saveUninitialized: false
})); 
app.locals.moment=require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The YelpCamp Server has started");
}); 