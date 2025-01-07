import User from "../Models/user.model.js";
import validator from 'validator'



export const createUser = async(email,password) =>{
    try{
        const hashedPassword = await User.hashPassword(password)
        const newUser = new User({email:email, password:hashedPassword})
        const token = await newUser.getJWT()
        await newUser.save()
        // console.log(newUser, token)
        return {newUser, token}
    }catch(err){
        return err
    }
}

export const logIn = async(email)=>{
    try{
        const foundUser = await User.findOne({email:email})
        const token = await foundUser.getJWT()
        return token
    }catch(err){
        return err
    }
}