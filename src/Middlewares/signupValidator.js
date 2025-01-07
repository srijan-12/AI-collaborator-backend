import validator from 'validator'
import User from '../Models/user.model.js'
export const signupValidator = async(req,res,next)=>{
    const{email,password} = req.body
    try{
        if(!email || ! password){
            throw new Error("e-mail and password are required")
        }
        if(!validator.isEmail(email) || !validator.isStrongPassword(password)){
            throw new Error("in-valid credentials")
        }
        const foundUser = await User.findOne({email: email})
        if(foundUser){
            throw new Error("This email is already taken")
        }
        next()
    }catch(err){
        return res.status(400).json({error : err.message})
    }
}