import Router from "express";
import { publishVideo,getAllVideos,getVideoById,updateVideo,deleteVideo,toggleVideoPublishStatus } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();
router.use(verifyJWT);

router.route("/").post(upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), publishVideo).get(getAllVideos);

router.route("/:videoId").get(getVideoById).patch(upload.single("thumbnail"), updateVideo).delete(deleteVideo);

router.route("/:videoId/toggle-publish").patch(toggleVideoPublishStatus);

export default router;