import { Router } from "express";
import { addComment,updateComment,deleteComment,getAllCommentsOfVideo } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:videoId").get(getAllCommentsOfVideo).post(addComment);
router.route("/comment/:commentId").patch(updateComment).delete(deleteComment);

export default router;

