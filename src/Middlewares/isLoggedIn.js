import jwt from 'jsonwebtoken'
import User from '../Models/user.model.js';
export const isLoggedIn = async(req,res,next)=>{
    const {token} = req.cookies
    try{
        if(!token){
            throw new Error("un-authorized");
        }
        const decodedValue = await jwt.verify(token, process.env.SECRET_KEY)
        const decodedValueUserId = decodedValue._id

        const foundUser = await User.findById(decodedValueUserId)
        if(!foundUser){
            throw new Error("un-authorized");
        }
        req.user = foundUser
        next()
        
    }catch(err){
        return res.status(400).json({error : err.message})
    }
}