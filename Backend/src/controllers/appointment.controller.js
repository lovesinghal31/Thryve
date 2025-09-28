import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

// Simple namespaced logger (mirrors emoji style used in user.controller.js)
const log = (...args) => console.log("📅 [Appointment]", ...args);
const warn = (...args) => console.warn("⚠️ [Appointment]", ...args);
const error = (...args) => console.error("❌ [Appointment]", ...args);

export const getCounselorAvailability = asyncHandler(async (req, res) => {
  log("🔍 Fetching counselor availability for user:", req.user?._id?.toString());
  const user = await User.findById(req.user._id);
  if (!user) {
    warn("User not found while fetching availability", req.user?._id?.toString());
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User not found"));
  }
  const institutionId = user.institutionId;
  log("🏫 Institution ID:", institutionId?.toString());
  const counselors = await User.find({ role: "counselor", institutionId });
  log(`👥 Found ${counselors.length} counselors in institution`);
  const counselorIds = counselors.map(c => c._id);
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const bookedAppointments = await Appointment.find({
    counselorId: { $in: counselorIds },
    status: "booked",
    startTime: { $gte: now, $lte: sevenDaysLater }
  });
  log(`🗓️ Booked appointments in next 7 days: ${bookedAppointments.length}`);
  const bookedCounselorIds = bookedAppointments.map(a => a.counselorId.toString());
  const availableCounselors = counselors.filter(c => !bookedCounselorIds.includes(c._id.toString()));
  log(`✅ Available counselors computed: ${availableCounselors.length}`);
  return res
    .status(200)
    .json(new ApiResponse(200, { availableCounselors }, "Available counselors fetched successfully"));
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  log("🔍 Fetching appointments for user:", req.user?._id?.toString(), "role:", req.user?.role);
  const { role, _id } = req.user;
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (role === "counselor") filter.counselorId = _id; else filter.studentId = _id;
  if (status) filter.status = status;
  log("📥 Query params:", { page, limit, status });
  log("🧪 Built filter:", JSON.stringify(filter));
  const numericLimit = Math.min(parseInt(limit) || 20, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const cursor = Appointment.find(filter)
    .sort({ startTime: 1 })
    .skip((numericPage - 1) * numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    Appointment.countDocuments(filter)
  ]);
  log(`📦 Returning ${items.length} appointments (total: ${total}) page ${numericPage}`);
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Appointments fetched"));
});

export const bookAppointment = asyncHandler(async (req, res) => {
  log("📝 Booking appointment attempt by user:", req.user?._id?.toString());
  const { counselorId, startTime, endTime, reason, screeningId, isEmergency = false } = req.body;
  log("📥 Payload received:", { counselorId, startTime, endTime, isEmergency, hasReason: !!reason, hasScreening: !!screeningId });
  if (!counselorId || !startTime || !endTime) throw new ApiError(400, "counselorId, startTime, endTime required");
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    warn("Invalid time range", { startTime, endTime });
    throw new ApiError(400, "Invalid time range");
  }
  const conflict = await Appointment.findOne({
    counselorId,
    status: { $in: ["booked"] },
    $or: [
      { startTime: { $lt: end, $gte: start } },
      { endTime: { $gt: start, $lte: end } },
      { startTime: { $lte: start }, endTime: { $gte: end } }
    ]
  });
  if (conflict) throw new ApiError(409, "Time slot already booked");
  if (conflict) warn("⛔ Conflict detected for counselor", counselorId);
  const appointment = await Appointment.create({
    studentId: req.user._id,
    counselorId,
    institutionId: req.user.institutionId,
    startTime: start,
    endTime: end,
    reason,
    screeningId,
    isEmergency
  });
  log("✅ Appointment booked:", appointment._id.toString());
  return res.status(201).json(new ApiResponse(201, appointment, "Appointment booked"));
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  log("🛑 Cancel appointment request:", req.params?.id);
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  if (
    appointment.studentId.toString() !== req.user._id.toString() &&
    appointment.counselorId.toString() !== req.user._id.toString() &&
    !["admin", "superadmin"].includes(req.user.role)
  ) {
    warn("Unauthorized cancel attempt by", req.user?._id?.toString());
    throw new ApiError(403, "Not authorized to cancel");
  }
  if (appointment.status !== "booked") throw new ApiError(400, "Only booked appointments can be cancelled");
  appointment.status = "cancelled";
  await appointment.save();
  log("✅ Appointment cancelled:", id);
  return res.status(200).json(new ApiResponse(200, appointment, "Appointment cancelled"));
});

export const completeAppointment = asyncHandler(async (req, res) => {
  log("✔️ Complete appointment request:", req.params?.id);
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  if (
    appointment.counselorId.toString() !== req.user._id.toString() &&
    !["admin", "superadmin"].includes(req.user.role)
  ) {
    warn("Unauthorized completion attempt by", req.user?._id?.toString());
    throw new ApiError(403, "Not authorized to complete");
  }
  if (appointment.status !== "booked") throw new ApiError(400, "Only booked appointments can be completed");
  appointment.status = "completed";
  await appointment.save();
  log("✅ Appointment completed:", id);
  return res.status(200).json(new ApiResponse(200, appointment, "Appointment completed"));
});
