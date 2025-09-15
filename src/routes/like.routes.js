import Router from "express";
import { toggleVideoLike,toggleCommentLike,toggleBlogLike,getLikedVideos } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:videoId").post(toggleVideoLike);
router.route("/comment/:commentId").post(toggleCommentLike);
router.route("/blog/:blogId").post(toggleBlogLike);
router.route("/liked-videos").get(getLikedVideos);

export default router;