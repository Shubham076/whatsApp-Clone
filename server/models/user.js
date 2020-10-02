
const mongoose  = require("mongoose");
const Room  = require("./room")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contactNo:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    rooms:[{type:mongoose.Schema.Types.ObjectId , ref:"Room"}]
})

module.exports = mongoose.model("User",userSchema)