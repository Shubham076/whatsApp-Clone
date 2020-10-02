const mongoose = require('mongoose');
const Message = require("./messages") 

const roomSchema = new mongoose.Schema({


    createdBy:{
        type:String,
        required:true
    },
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    users:[{
        contactNo:{
            type:String,
            required:true
        },
        roomName:{
            type:String
        }
    }],
    messages:[{type:mongoose.Schema.Types.ObjectId,ref:"Message"}]
},{
    _id:false
})

module.exports = mongoose.model("Room" , roomSchema);