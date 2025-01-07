import validator from 'validator'
import User from '../Models/user.model.js'
export const validateLogin = async(req,res,next)=>{
    console.log("validate")
    const {email,password} = req.body
    try{
        if(!email || ! password){
            throw new Error("e-mail and password are required")
        }
        if(!validator.isEmail(email) || !validator.isStrongPassword(password)){
            throw new Error("in-valid credentials1")
        }
        const foundUser = await User.findOne({email: email}).select('+password')
        if(!foundUser){
            throw new Error("invalid-credentials2")
        }else{
            const passwordResult = await foundUser.comparePassword(password)
            if(!passwordResult){
                throw new Error("invalid-credentials3")
            }
            const userWithoutPassword = foundUser.toObject()
            delete userWithoutPassword.password
            req.user = userWithoutPassword
            next()
        }
    }catch(err){
        return res.status(400).json({error : err.message})
    }
}