import dotenve from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";




dotenve.config({
    path:"./env"
})

connectDB().then(() => {
    console.log("Database connection successful");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.error("Database connection Failed:", error);
    process.exit(1);
});

