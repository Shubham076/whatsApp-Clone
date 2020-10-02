let io;
module.exports = {
    init: httpServer => {
        io = require("socket.io")(httpServer);
        io.on('connection' , socket => {
            id = socket.handshake.query.id;
            socket.join(id);

            socket.on('sendMessage',data => {
                socket.broadcast.to(data.message.receiver).emit('newMessage' ,{message:data.message});
            })

            socket.on('startTyping',data => {
                socket.broadcast.to(data.typing.receiver).emit('typing',{typing:true,roomId:data.typing.roomId})
            })

            socket.on('stopTyping',data => {
                socket.broadcast.to(data.typing.receiver).emit('typing',{typing:false,roomId:data.typing.roomId})
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
}