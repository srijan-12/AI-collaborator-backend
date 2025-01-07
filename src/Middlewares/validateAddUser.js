import User from "../Models/user.model.js";
import Project from "../Models/project.model.js";

export const validateAddUser = async(req, res, next) =>{
    try{
        const {projectId, newUserId} = req.body
        console.log(projectId, newUserId)
        const loggedInUserId = req.user._id
        if(!projectId){
            throw new Error("ProjectId is required")
        }
        if(!loggedInUserId){
            throw new Error("Logged in userId is required")
        }
        if(newUserId.length < 1){
            throw new Error("New userId is required")
        }

        const foundProject = await Project.findOne({
            _id: projectId,
            collabedUsers: { $in: [loggedInUserId] },
            collabedUsers: { $nin: newUserId }
        });

        const foundLoggedInUser = await User.findById(loggedInUserId)  
        const newFoundUsers = await User.find({ _id: { $in: newUserId } });

        console.log(foundProject,"This is found project")

        if(foundProject.length < 1){
            throw new Error('In-valid request')
        }
        if(!foundLoggedInUser){
            throw new Error('in-valid request login again')
        }
        if(!newFoundUsers){
            throw new Error('This user does not exists')
        }
        req.project = foundProject
        req.newUser = newFoundUsers
        next()
    }catch(err){
        res.status(400).json({result : null, error: err.message})
    }
}