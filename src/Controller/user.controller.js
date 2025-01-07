import User from "../Models/user.model.js";
import express from 'express'
import { createUser, logIn } from "../Services/user.services.js";
import { signupValidator } from "../Middlewares/signupValidator.js";
import { validateLogin } from "../Middlewares/loginValidator.js";
import { isLoggedIn } from "../Middlewares/isLoggedIn.js";
const userRouter = express.Router()

userRouter.post("/signup",signupValidator,async(req, res)=>{
    try{
        const {email, password} = req.body
        const newUser = await createUser(email,password)
        if(newUser instanceof Error){
            return res.status(400).json({error: newUser.message})
        }else{
            const token = newUser.token
            res.cookie("token", token,{maxAge: 1000 * 60 * 60 * 24})
            return res.status(200).json({result : "signed in",user: newUser.newUser})
        }
    }catch(err){
        return res.status(400).json({error: 'Un-expected error occured'})
    }
})


userRouter.post("/login", validateLogin, async(req,res)=>{
    const {email} = req.body
    const foundUser = req.user
    console.log(foundUser)
     try{
        const token = await logIn(email)
        res.cookie("token", token,{maxAge: 1000 * 60 * 60 * 24})
        return res.status(200).json({result: "logged in", user: foundUser})
    }catch(err){
        return res.status(400).json({error: 'Un-expected error occured'})
    }
})


userRouter.get("/profile",isLoggedIn, async(req,res)=>{
    try{
        const loggedInUser = req.user
        return res.status(200).json({result: loggedInUser})
    }catch(err){
        return res.status(400).json({error: 'Un-expected error occured'})
    }
})

userRouter.post("/logout", isLoggedIn, async(req,res)=>{
    res.cookie("token", null, {
        maxAge : 0
    } )
    res.status(200).json({"status":"logged out", "user" : null});
})


export default userRouter
