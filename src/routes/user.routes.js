import { Router } from "express";
import { registerControllerUser } from "../controllers/user.controller.js";


const router = Router();

router.route('/register').post(registerControllerUser)


export default router;