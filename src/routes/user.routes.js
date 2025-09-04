import { Router } from "express";
import { registerControllerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route('/register').post(
    upload.any(),
    registerControllerUser
)


export default router;