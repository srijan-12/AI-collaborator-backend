import { createProjectValidation } from "../Middlewares/createProjectValidation.js";
import Project from "../Models/project.model.js";
import express from 'express'
import { addUserToProject, createProjectService, getAllUser, getAllUserProjects, getProjectDetails } from "../Services/project.services.js";
import { isLoggedIn } from "../Middlewares/isLoggedIn.js";
import { validateAddUser } from "../Middlewares/validateAddUser.js";

const projectRouter = express.Router()

projectRouter.post('/create', isLoggedIn,createProjectValidation, async(req,res)=>{
    try{
        const {name} = req.body
        const loggedInUserId = req.user._id
        const createdProject = await createProjectService(name, loggedInUserId)
        if(createdProject instanceof Error){
            throw new Error(createdProject.error)
        }else{
            res.status(200).json({project: createdProject, error:null})
        }
    }catch(err){
        return res.status(400).json({project: null, error: err.message})
    }
})


projectRouter.get('/all', isLoggedIn, async(req,res)=>{
    try{
        const loggedInUserId = req.user._id
        const allProjects = await getAllUserProjects(loggedInUserId)
        if(allProjects.length > 0){
            return res.status(200).json({projects : allProjects, error:null})
        }else{
            return res.status(200).json({projects : "no projects yet", error:null})
        }
        
    }catch(err){
        return res.status(400).json({project: null, error: err.message})
    }
})


projectRouter.put("/add-user", isLoggedIn, validateAddUser, async(req,res)=>{
    const {projectId, newUserId} = req.body
    try{
        const result = await addUserToProject(newUserId ,projectId)
        if(result instanceof Error){
            throw new Error(result.error)
        }else{
            return res.status(200).json({project: result, error:null})
        }
    }catch(err){
        return res.status(400).json({project: null, error: err.message})
    }
})

projectRouter.post("/all-user", isLoggedIn, async(req,res)=>{
    try{
        const{id} = req.body
        const allUsersArray = await getAllUser(req.user._id,id)
        if(allUsersArray.length < 0){
            return res.status(200).json({allUsers: 'no users found', error: null})
        }else{
            return res.status(200).json({allUsers: allUsersArray, error: null})
        }
    }catch(err){
        return res.status(400).json({allUsers: null, error: err.message})
    }
})


projectRouter.get("/get-project/:id", isLoggedIn, async(req,res)=>{
    try{
        const {id} = req.params
        const getProject = await getProjectDetails(id)
        if(getProject instanceof Error){
            throw new Error("no such project")
        }
        return res.status(200).json({project: getProject, error: null})
    }catch(err){
        return res.status(400).json({project: null, error: err.message})
    }
})

export default projectRouter
