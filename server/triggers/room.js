const mongoose = require("mongoose");
const io = require("../socket");

module.exports = {
    init:()=>{
        console.log("working")
        const db = mongoose.connection;
        db.once("open" , () => {
            const roomCollection = db.collection("rooms");
            const roomChangeStream = roomCollection.watch();
            roomChangeStream.on("change" , (change) => {
                if(change.operationType === "insert"){
                    const newroom = change.fullDocument;
                    io.getIo().in(newroom.users[1].contactNo).emit('newRoom' ,{room:newroom});
                }
            })
        })

    }
}