// var mongoose= require("mongoose");
// var campgroundSchema= new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });
// module.exports=mongoose.model("Campground",campgroundSchema);



var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   createdAt:{type: Date,default:Date.now},
   author: {
      id: {
         type: mongoose.Schema.ObjectId,
         ref: "User"
      } ,
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);