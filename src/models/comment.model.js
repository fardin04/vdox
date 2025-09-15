import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, trim: true },
        video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
    { timestamps: true }
)




commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);