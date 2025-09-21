import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { listNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notification.controller.js";

const router = Router();

router
	.route("/")
	.get(verifyJWT, listNotifications);

router
	.route("/read-all")
	.post(verifyJWT, markAllNotificationsRead);

router
	.route("/:id/read")
	.post(verifyJWT, markNotificationRead);

export default router;
