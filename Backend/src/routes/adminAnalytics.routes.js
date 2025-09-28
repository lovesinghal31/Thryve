import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  adminListScreenings,
  adminScreeningStats,
  adminScreeningDailyTimeseries,
  adminScreeningRiskDistribution,
  adminScreeningToolSummary
} from "../controllers/adminScreening.controller.js";
import {
  adminListAppointments,
  adminAppointmentStatusSummary,
  adminAppointmentWeeklyStatus,
  adminAppointmentCounselorLoad,
  adminAppointmentFunnel
} from "../controllers/adminAppointment.controller.js";

const router = Router();

// All routes require authentication; controller enforces admin role.
router.use(verifyJWT);

// Screening analytics
router.get('/screenings', adminListScreenings);
router.get('/screenings/stats', adminScreeningStats);
router.get('/screenings/timeseries/daily', adminScreeningDailyTimeseries);
router.get('/screenings/distribution/risk', adminScreeningRiskDistribution);
router.get('/screenings/tools/summary', adminScreeningToolSummary);

// Appointment analytics
router.get('/appointments', adminListAppointments);
router.get('/appointments/status-summary', adminAppointmentStatusSummary);
router.get('/appointments/weekly-status', adminAppointmentWeeklyStatus);
router.get('/appointments/counselor-load', adminAppointmentCounselorLoad);
router.get('/appointments/funnel', adminAppointmentFunnel);

export default router;
