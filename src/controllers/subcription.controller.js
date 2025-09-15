import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiRes } from "../utils/ApiRes.js";
import { Subcription } from "../models/subcription.model.js";
import mongoose from "mongoose";

//toggle subscription

const toggleSubscription = asyncHandler(async(req, res) => {

    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError("Invalid channel ID", 400);
    }

    if (req.user._id.toString() === channelId) {
        throw new ApiError("You cannot subscribe to yourself", 400);
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError("Channel not found", 404);
    }

    const existingSubscription = await Subcription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if (existingSubscription) {
        // Unsubscribe
        await existingSubscription.remove();
        return res.status(200).json(new ApiRes("Unsubscribed successfully", 200, null));
    } else {
        // Subscribe
        const newSubscription = new Subcription({
            subscriber: req.user._id,
            channel: channelId
        });

        await newSubscription.save();
        return res.status(200).json(new ApiRes("Subscribed successfully", 200, null));
    }
})

// subscriber list of a channel

const getUserChannelSubscribers = asyncHandler(async(req, res) => {

    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError("Invalid channel ID", 400);
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError("Channel not found", 404);
    }

    const subscribers = await Subcription.find({ channel: channelId }).populate('subscriber', '-password -refreshToken -__v -createdAt -updatedAt');

    res.status(200).json(new ApiRes("Subscribers fetched successfully", 200, subscribers.map(sub => sub.subscriber)));

})

//channel list of a user

const getSubscribedChannels = asyncHandler(async(req, res) => {

    const subscriptions = await Subcription.find({ subscriber: req.user._id }).populate('channel', '-password -refreshToken -__v -createdAt -updatedAt');

    res.status(200).json(new ApiRes("Subscribed channels fetched successfully", 200, subscriptions.map(sub => sub.channel)));

})




export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }