import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


const dbName ="practice"

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please provide proper MONGODB_URI ..."
  );
}

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log("DB Connected");
        
    } catch (error) {
        console.log("Mongodb connection error",error)
        process.exit(1)
        
    }
}

export default connectDB;