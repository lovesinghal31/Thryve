import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { listCompletedResources, markResourceCompleted } from "../controllers/resource.controller.js";

const router = Router();

router
	.route("/completed")
	.get(verifyJWT, listCompletedResources);

router
	.route("/:resourceId/complete")
	.post(verifyJWT, markResourceCompleted);

export default router;
