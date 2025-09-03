import dotenve from "dotenv";
import connectDB from "./db/index.js";




dotenve.config({
    path:"./env"
})

connectDB();

