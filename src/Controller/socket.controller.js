import { Socket } from "socket.io"
import { generateResult } from "../Services/ai.services.js"


export const handleSocket = (io) =>{
    io.on('connection', socket=>{
        // console.log(`A user is connected with socket id ${socket.user}`)

        socket.join(socket.project._id.toString())

        socket.on('send-message', async({messageInput, messageSender}) =>{
            if(messageInput.includes('@ai')) {
                const requiredPrompt = messageInput.split('@ai')
                const generatedRes = await generateResult(requiredPrompt[1])
                return io.to(socket.project._id.toString()).emit('recieve-message',{data:generatedRes, messageSender:{
                    _id : 'ai',
                    email : 'AI'
                }})
            }
            socket.broadcast.to(socket.project._id.toString()).emit('recieve-message',{data:messageInput, messageSender})
        })

        socket.on('disconnect', () => {
            console.log(`A user is disconnected with socket id ${socket.id}`);
            socket.leave(socket.project._id.toString())
          });
    })    
}