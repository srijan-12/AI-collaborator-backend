import Project from "../Models/project.model.js";
import User from "../Models/user.model.js";

export const createProjectService = async(name ,collabedUsers) =>{
    try{
        const newProject = new Project({name:name, collabedUsers:collabedUsers})
        await newProject.save()
        return newProject
    }catch(err){
        return err.message
    }
}


export const getAllUserProjects = async(userId) =>{
    try{
        const allProjects = await Project.find({collabedUsers:{ $in: [userId] }})
        return allProjects
    }catch(err){
        return err.message
    }
}


export const addUserToProject = async (newUserId, projectId) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $addToSet: { collabedUsers: { $each: newUserId } } },
            { new: true }
        );
        return updatedProject.collabedUsers;
    } catch (err) {
        console.error("Error adding users to project:", err.message);
        throw err;
    }
};



export const getAllUser = async (loggedInUserId, projectId) => {
    try {
        const foundProject = await Project.findById(projectId)
        if(!foundProject){
            throw new Error('No such project')
        }
        const usersArray = foundProject.collabedUsers
        const allUsersArray = await User.find(
            {_id: { $nin: [loggedInUserId, ...usersArray] }}
        );
        // if(allUsersArray.length < 1){
        //     throw new Error('No available user')
        // }
        return allUsersArray;
    } catch (err) {
        console.error("Error adding user to project:", err.message);
        throw err;
    }
};


export const getProjectDetails = async(projectId) =>{
    try {
        const getProject = await Project.findById(projectId).populate({
            path : 'collabedUsers'
        });
        if(!getProject){
            throw new Error("No such project")
        }
        return getProject;
    } catch (err) {
        console.error("Error adding user to project:", err.message);
        throw err;
    }
}



