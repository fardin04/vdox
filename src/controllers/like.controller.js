import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiRes } from "../utils/ApiRes.js";
import { ApiError } from "../utils/ApiError.js";



//toggle like for video

const toggleVideoLike = asyncHandler(async(req, res) => {

    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400,"Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {
        // Unlike the video
        await existingLike.remove();
        return res.status(200).json(new ApiRes(200,null, "Video unliked successfully"));
    } else {
        // Like the video
        const newLike = new Like({
            video: videoId,
            likedBy: req.user._id
        });

        await newLike.save();
        return res.status(200).json(new ApiRes(200,null, "Video liked successfully"));
    }
})

// toggle like for comment

const toggleCommentLike = asyncHandler(async(req, res) => {

    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError("Invalid comment ID", 400);
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        // Unlike the comment
        await existingLike.remove();
        return res.status(200).json(new ApiRes(200,null, "Comment unliked successfully"));
    } else {
        // Like the comment
        const newLike = new Like({
            comment: commentId,
            likedBy: req.user._id
        });

        await newLike.save();
        return res.status(200).json(new ApiRes(200,null, "Comment liked successfully"));
    }
})

// toggle like for blog

const toggleBlogLike = asyncHandler(async(req, res) => {

    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new ApiError(400,"Invalid blog ID");
    }

    const existingLike = await Like.findOne({
        blog: blogId,
        likedBy: req.user._id
    });

    if (existingLike) {
        // Unlike the blog
        await existingLike.remove();
        return res.status(200).json(new ApiRes(200,null, "Blog unliked successfully"));
    } else {
        // Like the blog
        const newLike = new Like({
            blog: blogId,
            likedBy: req.user._id
        });

        await newLike.save();
        return res.status(200).json(new ApiRes(200,null, "Blog liked successfully"));
    }


})

// get liked videos of a user

const getLikedVideos = asyncHandler(async(req, res) => {

    const likes = await Like.find({ likedBy: req.user._id, video: { $ne: null } }).populate("video");

    const likedVideos = likes.map(like => like.video);

    return res.status(200).json(new ApiRes(200, likedVideos, "Liked videos fetched successfully"));

})



export { toggleVideoLike, toggleCommentLike, toggleBlogLike, getLikedVideos };