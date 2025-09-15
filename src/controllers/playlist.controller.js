import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiRes } from "../utils/ApiRes.js";

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError("Playlist name is required", 400);
    }

    const newPlaylist = new Playlist({
        name,
        description,
        createdBy: req.user._id,
    });

    await newPlaylist.save();

    res.status(201).json(new ApiRes(201, newPlaylist, "Playlist created successfully"));
});

// get all playlists of the logged-in user

const getUserPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ createdBy: req.user._id }).populate('videos').exec();
    res.status(200).json(new ApiRes(200, playlists, "User playlists fetched successfully"));
});

// get a specific playlist by ID

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400);
    }

    const playlist = await Playlist.findById(playlistId).populate('videos').exec();

    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to view this playlist", 403);
    }

    res.status(200).json(new ApiRes(200, playlist, "Playlist fetched successfully"));
});

// add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to modify this playlist", 403);
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError("Video already in playlist", 400);
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiRes(200, playlist, "Video added to playlist successfully"));
});

// remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError("Invalid video ID", 400);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to modify this playlist", 403);
    }

    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) {
        throw new ApiError("Video not found in playlist", 404);
    }

    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    res.status(200).json(new ApiRes(200, playlist, "Video removed from playlist successfully"));
});

// update playlist details
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to update this playlist", 403);
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;

    await playlist.save();

    res.status(200).json(new ApiRes(200, playlist, "Playlist updated successfully"));
});

// delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400);
    }
    
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to delete this playlist", 403);
    }

    await playlist.remove();

    res.status(200).json(new ApiRes(200, null, "Playlist deleted successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
};

