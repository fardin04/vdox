import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiRes } from "../utils/ApiRes.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Subcription } from "../models/subcription.model.js";


// channel stats

const getChannelStats = asyncHandler(async(req, res) => {

    const userId = req.user._id;

    const totalVideos = await Video.countDocuments({ owner: userId });
    const totalLikes = await Like.countDocuments({ likedBy: userId });
    const totalSubscribers = await Subcription.countDocuments({ channel: userId });

    const stats = {
        totalVideos,
        totalLikes,
        totalSubscribers
    };

    return res.status(200).json(new ApiRes(200, stats, "Channel stats fetched successfully"));

})

//All video of a channel

const getAllChannelVideos = asyncHandler(async(req, res) => {

    const userId = req.user._id;

    const videos = await Video.find({ owner: userId }).populate("owner", "name email");

    return res.status(200).json(new ApiRes(200, videos, "Channel videos fetched successfully"));

})  



export { getChannelStats, getAllChannelVideos };