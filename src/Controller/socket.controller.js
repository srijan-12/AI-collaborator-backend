import { Socket } from "socket.io"


export const handleSocket = (io) =>{
    io.on('connection', socket=>{
        // console.log(`A user is connected with socket id ${socket.user}`)

        socket.join(socket.project._id.toString())

        socket.on('send-message', data =>{
            // console.log(data, 'this is the message sent by', socket.user, 'in room id', socket.project._id.toString())
            socket.broadcast.to(socket.project._id.toString()).emit('recieve-message',{data,user:socket.user})
        })

        socket.on('disconnect', () => {
            console.log(`A user is disconnected with socket id ${socket.id}`);
          });
    })    
}