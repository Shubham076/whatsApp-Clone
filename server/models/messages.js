const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    _id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:new Date().toISOString(),
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    date:{
        type:String,
        required:true,
    },
    read:{
        type:Boolean,
        required:true
    }
},{
    _id:false
})

module.exports = mongoose.model("Message",MessageSchema);