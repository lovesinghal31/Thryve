import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyScreenings, getMyLatestScreening } from "../controllers/screening.controller.js";

const router = Router();

router
	.route("/")
	.get(verifyJWT, getMyScreenings);

router
	.route("/latest")
	.get(verifyJWT, getMyLatestScreening);

export default router;
