import mongoose from "mongoose";


const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description:{ type: String, default: null, trim: true },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});




export const Blog = mongoose.model("Blog", playlistSchema);