import mongoose from "mongoose";


const blogSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, trim: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

    }, { timestamps: true }
)



export const Blog = mongoose.model("Blog", blogSchema);