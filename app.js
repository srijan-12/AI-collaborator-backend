import express from 'express'
import http from 'http'
import 'dotenv/config.js'
import { connectToDb } from './dbConfig.js'
import userRouter from './src/Controller/user.controller.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import projectRouter from './src/Controller/project.controller.js'
import { Server } from 'socket.io'
import { handleSocket } from './src/Controller/socket.controller.js'
import jwt from 'jsonwebtoken'
import Project from './src/Models/project.model.js'
import User from './src/Models/user.model.js'
import aiRouter from './src/Controller/ai.controller.js'
const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
})


//socket auth
io.use(async(socket,next)=>{
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.split(' ')[1]
        const projectId = socket.handshake.query?.projectId
        // console.log(projectId, 'this is project id')
        const foundProject = await Project.findById(projectId)
        if(!foundProject){
            throw new Error('in-valid room')
        }
        socket.project = foundProject
        if(!token){
            throw new Error('No token found')
        }else{
            const decodedValue = jwt.verify(token, process.env.SECRET_KEY)
            if(!decodedValue){
                throw new Error('Autherization failed')
            }
            socket.project = foundProject
            const FoundUser = await User.findById(decodedValue._id)
            socket.user = FoundUser
            next()
        }
    }catch(err){
        console.log(err.message)
        next(err.message)
    }
})


const port = process.env.PORT || 3000
server.listen(port,async()=>{
    connectToDb().then(()=>{
        console.log(`Database is connected`)
        console.log(`Server is running at port ${port}`)
    }).catch((err)=>{
        console.log(err)
    })
})

app.use(express.json())
app.use(cookieParser())
app.use("/api/user", userRouter)
app.use('/api/project', projectRouter)
app.use('/api/ai', aiRouter)
handleSocket(io)