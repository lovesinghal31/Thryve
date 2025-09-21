import { Router } from "express";
import { getAdminDashboardStats } from "../controllers/adminDashboard.controller.js";

const router = Router();

router.route("/admin-dashboard").get(getAdminDashboardStats);

export default router;