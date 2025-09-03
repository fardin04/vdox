import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
       const connectionInfo = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n Database Connected! DB Host: ${connectionInfo.connection.host}\n`);
       
        
    } catch (error) {
        console.error("Database connection error",error);
        process.exit(1)
        
    }
}

export default connectDB;