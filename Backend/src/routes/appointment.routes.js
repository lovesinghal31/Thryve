import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyAppointments, bookAppointment, cancelAppointment, completeAppointment, getCounselorAvailability } from "../controllers/appointment.controller.js";

const router = Router();

router
	.route("/")
	.get(verifyJWT, getMyAppointments)
	.post(verifyJWT, bookAppointment);

router
	.route("/counselors/availability")
	.get(verifyJWT, getCounselorAvailability);

router
	.route("/:id/cancel")
	.post(verifyJWT, cancelAppointment);

router
	.route("/:id/complete")
	.post(verifyJWT, completeAppointment);

export default router;
