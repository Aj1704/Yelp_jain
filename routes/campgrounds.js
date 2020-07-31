var express= require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

//index -show all camps
router.get("/",function(req,res){
    // console.log(req.user);
    //Get all campgrounds
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campground/index",{campgrounds:allcampgrounds, page:'campgrounds'});
        }
    })
});

//create- new camp addition
router.post("/",middleware.isLoggedIn ,function(req,res){

    var name =req.body.name;
    var price= req.body.price;
    var image= req.body.image;
    var desc= req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampgrounds={name:name ,price:price, image:image,description:desc,author:author};
    // console.log(req.user);
    Campground.create(newCampgrounds,function(err,newlycreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campgrounds page
            console.log(newlycreated);
            res.redirect("/campgrounds");
        }
    });


});


//new -show form to create a camp
router.get("/new",middleware.isLoggedIn ,function(req,res){
    res.render("campground/new");
});

//show 
router.get("/:id",function(req,res){
    //find campground with id and show adn render the info of camp
 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("campground/show",{campground: foundCampground});
        }
    });


});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground){
        res.render("campground/edit",{campground:foundCampground});
});
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    //find and update the coprrect campgrund
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    //redirect to somewhere(show page)

});

//destroy campground rpute
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    // res.send("You are deleting it");
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

//middleware

// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         //does the user own the campground

//         Campground.findById(req.params.id,function(err, foundCampground){
//             if(err){
//                 res.redirect("back");
//             } else{
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 } else{
//                     res.redirect("back");
//                 }
                
//             }
//         });
//     } else{
//         res.redirect("back");
//     }
// }

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }



module.exports=router;