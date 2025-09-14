import { Router } from "express";
import { loginUser,registerControllerUser , logoutUser,refreshAccessToken, changeCurrentPassword,getCurrentUser,updateUserProfile,getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/register').post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerControllerUser
)

router.route('/login').post(
    loginUser
)

router.route('/logout').post(
    verifyJWT,logoutUser
)

router.route('/refresh-token').post(
    refreshAccessToken
)     
router.route('/change-password').post(
    verifyJWT,changeCurrentPassword
)
router.route('/current-user').get(
    verifyJWT,getCurrentUser
)
router.route('/update-profile').patch(
    verifyJWT,updateUserProfile
)
router.route('/channel/:username').get(
    verifyJWT,getUserChannelProfile
)


router.route('/watch-history').get(
    verifyJWT,getWatchHistory
)



export default router;