import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiRes.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";


// add comment to a video

const addComment = asyncHandler(async(req, res) => {

    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    if (!content || content.trim() === "") {
        throw new ApiError("Comment content cannot be empty", 400);
    }

    const newComment = new Comment({
        content,
        video: videoId,
        owner: req.user._id
    });

    await newComment.save();

    return res.status(201).json(new ApiRes(201, newComment, "Comment added successfully"));

})

//update comment

const updateComment = asyncHandler(async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError("Invalid comment ID", 400);
    }

    if (!content || content.trim() === "") {
        throw new ApiError("Comment content cannot be empty", 400);
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError("Comment not found", 404);
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to update this comment", 403);
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(new ApiRes(200, comment, "Comment updated successfully"));

})

//delete comment

const deleteComment = asyncHandler(async(req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError("Invalid comment ID", 400);
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError("Comment not found", 404);
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to delete this comment", 403);
    }

    await comment.remove();

    return res.status(200).json(new ApiRes(200, null, "Comment deleted successfully"));

})

//all comment of a video

const getAllCommentsOfVideo = asyncHandler(async(req, res) => {

    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: { path: 'owner', select: 'username email avatar' }
    };

    const query = { video: videoId };

    const result = await Comment.aggregatePaginate(Comment.aggregate([
        { $match: query }
    ]), options);

    return res.status(200).json(new ApiRes(200, result, "Comments fetched successfully"));

})





export { addComment, updateComment, deleteComment, getAllCommentsOfVideo };