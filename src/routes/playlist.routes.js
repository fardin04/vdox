import Router from "express";
import { createPlaylist,getPlaylistById,getUserPlaylists,addVideoToPlaylist,removeVideoFromPlaylist,updatePlaylist,deletePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route('/').post(
    createPlaylist
).get(
    getUserPlaylists
)

router.route('/:playlistId').get(
    getPlaylistById
).patch(
    updatePlaylist
).delete(
    deletePlaylist
)

router.route('/:playlistId/add-video').post(
    addVideoToPlaylist
)

router.route('/:playlistId/remove-video/:videoId').delete(
    removeVideoFromPlaylist
)

export default router;