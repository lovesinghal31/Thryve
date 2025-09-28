import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

const log = (...args) => console.log("📅 [AdminAppointment]", ...args);
const ensureAdmin = (user) => { if (!user || !["admin","superadmin"].includes(user.role)) throw new ApiError(403,"Admin access required"); };

// List appointments with filters
// Query: page, limit, institutionId, counselorId, studentId, status, isEmergency(true/false), from, to
export const adminListAppointments = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { page=1, limit=25, institutionId, counselorId, studentId, status, isEmergency, from, to } = req.query;
  const filter = {};
  if (institutionId) filter.institutionId = institutionId;
  if (counselorId) filter.counselorId = counselorId;
  if (studentId) filter.studentId = studentId;
  if (status) filter.status = status;
  if (isEmergency === 'true') filter.isEmergency = true; else if (isEmergency === 'false') filter.isEmergency = false;
  if (from || to) {
    filter.startTime = {};
    if (from) filter.startTime.$gte = new Date(from);
    if (to) filter.startTime.$lte = new Date(to);
  }
  const numericLimit = Math.min(parseInt(limit) || 25, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const cursor = Appointment.find(filter).sort({ startTime: -1 })
    .skip((numericPage-1)*numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    Appointment.countDocuments(filter)
  ]);
  console.log(`📦 Returning ${items.length} appointments (total: ${total}) page ${numericPage}`);
  return res.status(200).json(new ApiResponse(200, { items, total, page: numericPage, pages: Math.ceil(total/numericLimit) }, 'Appointments listed'));
});

// Status summary (optionally filtered by institution & date range)
export const adminAppointmentStatusSummary = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { institutionId, from, to } = req.query;
  const match = {};
  if (institutionId) match.institutionId = institutionId;
  if (from || to) {
    match.startTime = {};
    if (from) match.startTime.$gte = new Date(from);
    if (to) match.startTime.$lte = new Date(to);
  }
  const pipeline = [
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 }, emergency: { $sum: { $cond: ["$isEmergency", 1, 0] } } } },
    { $sort: { _id: 1 } }
  ];
  const rows = await Appointment.aggregate(pipeline);
  const total = rows.reduce((a,b)=>a+b.count,0);
  const statuses = rows.map(r => ({ status: r._id, count: r.count, pct: total? +(r.count/total*100).toFixed(2):0, emergencies: r.emergency }));
  console.log(`📊 Status summary computed: total=${total}, statuses=${JSON.stringify(statuses)}`);
  return res.status(200).json(new ApiResponse(200, { total, statuses }, 'Appointment status summary'));
});

// Weekly status series for last N weeks (default 8)
export const adminAppointmentWeeklyStatus = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { weeks=8, institutionId } = req.query;
  const w = Math.min(Math.max(parseInt(weeks)||8,1),26);
  const since = new Date(Date.now() - (w-1)*7*86400000);
  const match = { startTime: { $gte: since } };
  if (institutionId) match.institutionId = institutionId;
  // Group by ISO week (approx using dateToString format %G-W%V for ISO week-year if MongoDB supports; fallback custom calc if not)
  const pipeline = [
    { $match: match },
    { $addFields: { weekKey: { $dateToString: { format: "%G-W%V", date: "$startTime" } } } },
    { $group: { _id: { week: "$weekKey", status: "$status" }, count: { $sum:1 } } },
    { $group: { _id: "$_id.week", statuses: { $push: { status: "$_id.status", count: "$count" } } } },
    { $sort: { _id: 1 } }
  ];
  const rows = await Appointment.aggregate(pipeline);
  // Build map
  const map = new Map(rows.map(r => [r._id, r.statuses]));
  const orderedWeeks = Array.from({ length: w }).map((_,i)=>{
    const ref = new Date(since.getTime() + i*7*86400000);
    const year = ref.getUTCFullYear();
    const oneJan = new Date(Date.UTC(year,0,1));
    const week = Math.ceil((((ref - oneJan)/86400000)+ oneJan.getUTCDay()+1)/7);
    return `${year}-W${week}`;
  });
  const statusKeys = ["booked","completed","cancelled","no-show"];
  const series = statusKeys.map(k => ({ key: k, label: k.charAt(0).toUpperCase()+k.slice(1), values: orderedWeeks.map(wk => {
    const list = map.get(wk) || [];
    const found = list.find(x=>x.status===k);
    return found? found.count:0;
  }) }));
  console.log(`📈 Weekly status series computed for ${orderedWeeks.length} weeks`);
  return res.status(200).json(new ApiResponse(200, { granularity: 'week', categories: orderedWeeks, series }, 'Weekly appointment status'));
});

// Counselor load (active upcoming + total completed in last 30 days)
export const adminAppointmentCounselorLoad = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { institutionId } = req.query;
  const now = new Date();
  const past30 = new Date(Date.now() - 30*86400000);
  const matchUpcoming = { startTime: { $gte: now } };
  const matchCompleted = { startTime: { $gte: past30 }, status: 'completed' };
  if (institutionId) { matchUpcoming.institutionId = institutionId; matchCompleted.institutionId = institutionId; }
  const [upcoming, completed] = await Promise.all([
    Appointment.aggregate([
      { $match: matchUpcoming },
      { $group: { _id: "$counselorId", upcoming: { $sum:1 } } }
    ]),
    Appointment.aggregate([
      { $match: matchCompleted },
      { $group: { _id: "$counselorId", completed: { $sum:1 } } }
    ])
  ]);
  const compMap = new Map(completed.map(r => [r._id.toString(), r.completed]));
  // Fetch counselor basic details (username) for those appearing in upcoming list
  const counselorIds = upcoming.filter(u => u._id).map(u => u._id);
  const users = counselorIds.length ? await User.find({ _id: { $in: counselorIds } }, { username: 1 }).lean() : [];
  const userMap = new Map(users.map(u => [u._id.toString(), u.username]));
  const items = upcoming.map(u => ({
    counselorId: u._id,
    username: userMap.get(u._id?.toString()) || null,
    upcoming: u.upcoming,
    completed30d: compMap.get(u._id?.toString()) || 0
  }));
  return res.status(200).json(new ApiResponse(200, { items }, 'Counselor load'));
});

// Appointment funnel approximation (last 30 days)
export const adminAppointmentFunnel = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { institutionId } = req.query;
  const since = new Date(Date.now() - 30*86400000);
  const match = { createdAt: { $gte: since } };
  if (institutionId) match.institutionId = institutionId;

  // We approximate funnel stages using appointment statuses & flags
  const totalBooked = await Appointment.countDocuments({ ...match, status: { $in: ['booked','completed','cancelled','no-show'] } });
  const completed = await Appointment.countDocuments({ ...match, status: 'completed' });
  const cancelled = await Appointment.countDocuments({ ...match, status: 'cancelled' });
  const noShow = await Appointment.countDocuments({ ...match, status: 'no-show' });
  const emergency = await Appointment.countDocuments({ ...match, isEmergency: true });

  const stages = [
    { key: 'booked', label: 'Booked', value: totalBooked },
    { key: 'completed', label: 'Completed', value: completed },
    { key: 'cancelled', label: 'Cancelled', value: cancelled },
    { key: 'noShow', label: 'No Show', value: noShow },
  ];
  const conversionRate = totalBooked ? +(completed / totalBooked).toFixed(3) : 0;
  console.log(`📈 Appointment funnel computed: totalBooked=${totalBooked}, completed=${completed}, conversionRate=${conversionRate}`);
  return res.status(200).json(new ApiResponse(200, { period: { from: since.toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) }, stages, conversionRate, emergencyCount: emergency }, 'Appointment funnel'));
});
