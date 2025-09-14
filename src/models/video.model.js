import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoFile: { type: String, required: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: null, trim: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, default: null },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    duration: { type: Number, required: true }, // duration in seconds
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, trim: true, index: true }],
    isPublished: { type: Boolean, default: true },
    commentsEnabled: { type: Boolean, default: true },
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);