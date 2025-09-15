import Router from "express";
import { getUserBlogs,updateBlog,createBlog,deleteBlog } from "../controllers/blog.controller.js";
import { verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route('/').post(
    createBlog
)

router.route('/user/:userId').get(
    getUserBlogs
)

router.route('/:blogId').patch(
    updateBlog
).delete(
    deleteBlog
)

export default router;
