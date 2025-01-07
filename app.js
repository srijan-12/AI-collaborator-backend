import express from 'express'
import http from 'http'
import 'dotenv/config.js'
import { connectToDb } from './dbConfig.js'
import userRouter from './src/Controller/user.controller.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import projectRouter from './src/Controller/project.controller.js'

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const server = http.createServer(app)
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