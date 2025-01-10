import express, { response } from 'express'
import { generateResult } from '../Services/ai.services.js'

const aiRouter = express.Router()

aiRouter.post('/generate-prompt', async(req,res)=>{
    try{
        const {prompt} = req.body
        if(!prompt){
            throw new Error('Prompt is required')
        }
        const result = await generateResult(prompt)
        if(!result){
            throw new Error('Something went wrong no results found')
        }
        return res.status(200).json({response: result, error: null})
    }catch(err){
        return res.status(400).json({response: null, error: err.message})
    }
})




export default aiRouter