import validator from 'validator'
import Project from '../Models/project.model.js'

export const createProjectValidation = async(req,res, next) =>{
    try{
        const{name, collabedUsers} = req.body
        const foundProject = await Project.findOne({name: name})
        if(!name || !name.length > 3){
            throw new Error("Valid project name is required")
        }
        if(foundProject){
            throw new Error("Project name is already taken")
        }
        next()
    }catch(err){
        res.status(400).json({result : null , error: err.message})
    }
}