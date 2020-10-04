const Message = require("../models/messages")
const Room = require("../models/room")


exports.addMessage = async (req,res,next) => {
    let message = req.body.message;
    try{
        let new_message = new Message(message);
        let newMessage = await new_message.save();
        let room = await Room.findById(message.roomId);
        room.messages.push(newMessage._id);
        await room.save();

        res.status(201).json({
            message:"Success"
        })
    }
    catch(err){
        next(err)
    }
}

exports.markMessagesRead = async (req,res,next) => {
    let messages = req.body.messages;
    try{
        for(let m of messages){
            let msg = await Message.findByIdAndUpdate(m , {read:true});
        }
        res.status(201).json({
            message:'Success'
        })
    }
    catch(err){
        next(err);
    }
 
}