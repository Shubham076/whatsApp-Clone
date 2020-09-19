let io;
let Socket;
module.exports = {
    init: httpServer => {
        io = require("socket.io")(httpServer);
        io.on('connection' , socket => {
            console.log("A user connected")
            Socket  = socket
            socket.on('disconnect' , ()=>{
                console.log("A user disconnected")
            })

        })
        return io;
    },

    getIo: () => {
        if(!io){
            throw new Error("io is not initialized")
        }

        return io;
    },

    getSocket : () => {
        if(!Socket){
            throw new Error("Socket is not initialized")
        }

        return Socket;
    }
}