import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    email  : {
        type : String,
        required : true,
        unique : true,
        trim :true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter valid email')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        select : false,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please enter a strong password')
            }
        }
    }
})


userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({_id : this._id}, process.env.SECRET_KEY,{expiresIn: "7d"})
    return token;
}
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}
const User = mongoose.model("User", userSchema)
export default User