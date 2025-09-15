import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiRes.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";


// publish a new video
const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!title || !description || !videoFile) {
        throw new ApiError("Title, description, and video file are required", 400);
    }

    // Upload video to Cloudinary
    const uploadResult = await cloudinaryUpload(videoFile.path, 'videos');

    const newVideo = new Video({
        title,
        description,
        videoUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        owner: req.user._id,
    });

    await newVideo.save();

    res.status(201).json(new ApiRes(201, newVideo, "Video published successfully"));
});

// get all videos

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ isPublished: true }).populate('owner', 'username email').exec();
    res.status(200).json(new ApiRes(200, videos, "All videos fetched successfully"));
});

// get a specific video by ID

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const video = await Video.findById(videoId).populate('owner', 'username email').exec();

    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    res.status(200).json(new ApiRes(200, video, "Video fetched successfully"));
});

// update video details

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to update this video", 403);
    }

    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();

    res.status(200).json(new ApiRes(200, video, "Video updated successfully"));
});

// delete a video

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to delete this video", 403);
    }

    await video.remove();

    res.status(200).json(new ApiRes(200, null, "Video deleted successfully"));
});

// toggle video publish status

const toggleVideoPublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to change the publish status of this video", 403);
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiRes(200, video, `Video ${video.isPublished ? 'published' : 'unpublished'} successfully`));
});

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    toggleVideoPublishStatus
};