import mongoose from "mongoose";

const connectionString = process.env.CONNECTIONSTRING
export const connectToDb = async()=>{
    await mongoose.connect(connectionString)
}