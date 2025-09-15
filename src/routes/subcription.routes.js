import Router from "express";
import { toggleSubscription,getSubscribedChannels,getUserChannelSubscribers } from "../controllers/subcription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

router.route('/:channelId').post(
    toggleSubscription
)

router.route('/subscribed-channels').get(
    getSubscribedChannels
)

router.route('/channel-subscribers/:channelId').get(
    getUserChannelSubscribers
)

export default router;