import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Screening } from "../models/screening.model.js";

// Utility helpers
const log = (...args) => console.log("🧪 [AdminScreening]", ...args);

// Ensure admin / superadmin
const ensureAdmin = (user) => {
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    throw new ApiError(403, "Admin access required");
  }
};

// List screenings (admin scope, optional filters)
// Query: page, limit, institutionId, tool, riskLevel, status, studentId
export const adminListScreenings = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { page = 1, limit = 25, institutionId, tool, riskLevel, status, studentId } = req.query;
  const filter = {};
  if (institutionId) filter.institutionId = institutionId;
  if (tool) filter.tool = tool;
  if (riskLevel) filter.riskLevel = riskLevel;
  if (status) filter.status = status;
  if (studentId) filter.studentId = studentId;
  const numericLimit = Math.min(parseInt(limit) || 25, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const cursor = Screening.find(filter).sort({ createdAt: -1 })
    .skip((numericPage - 1) * numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    Screening.countDocuments(filter)
  ]);
  console.log(`📦 Returning ${items.length} screenings (total: ${total}) page ${numericPage}`);
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Screenings listed"));
});

// Aggregate current month stats (synthetic if needed)
export const adminScreeningStats = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { institutionId } = req.query;
  const match = {};
  if (institutionId) match.institutionId = institutionId;
  // Last 30 days
  const since = new Date(Date.now() - 30 * 86400000);
  match.createdAt = { $gte: since };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        submitted: { $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] } },
        byTool: { $push: "$tool" },
        byRisk: { $push: "$riskLevel" },
        avgScore: { $avg: "$totalScore" }
      }
    }
  ];
  const agg = await Screening.aggregate(pipeline);
  const base = agg[0] || { total: 0, submitted: 0, byTool: [], byRisk: [], avgScore: 0 };

  const toolCounts = base.byTool.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const riskCounts = base.byRisk.reduce((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc; }, {});

  const payload = {
    period: { from: since.toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) },
    totalScreenings: base.total,
    submittedScreenings: base.submitted,
    completionRate: base.total ? +(base.submitted / base.total).toFixed(2) : 0,
    averageTotalScore: +base.avgScore.toFixed(2),
    toolDistribution: toolCounts,
    riskDistribution: riskCounts
  };
  console.log("📊 Screening stats computed:", payload);
  return res.status(200).json(new ApiResponse(200, payload, "Screening stats"));
});

// Daily timeseries for last N days (default 14)
export const adminScreeningDailyTimeseries = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { days = 14, institutionId } = req.query;
  const d = Math.min(Math.max(parseInt(days) || 14, 1), 60);
  const since = new Date(Date.now() - (d - 1) * 86400000);
  const match = { createdAt: { $gte: since } };
  if (institutionId) match.institutionId = institutionId;

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];
  const rows = await Screening.aggregate(pipeline);
  const map = new Map(rows.map(r => [r._id, r.count]));
  const series = Array.from({ length: d }).map((_, idx) => {
    const day = new Date(since.getTime() + idx * 86400000).toISOString().slice(0,10);
    return { date: day, value: map.get(day) || 0 };
  });
//   console.log(`📈 Screening daily timeseries computed for ${orderedWeeks.length} weeks`);
  return res.status(200).json(new ApiResponse(200, { metric: 'screenings_daily', series }, 'Screening daily timeseries'));
});

// Risk level distribution (all time or filtered by tool)
export const adminScreeningRiskDistribution = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { institutionId, tool } = req.query;
  const match = {};
  if (institutionId) match.institutionId = institutionId;
  if (tool) match.tool = tool;
  const pipeline = [
    { $match: match },
    { $group: { _id: "$riskLevel", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];
  const rows = await Screening.aggregate(pipeline);
  const total = rows.reduce((a,b) => a + b.count, 0);
  const items = rows.map(r => ({ key: r._id, label: r._id, value: r.count, pct: total ? +(r.count/total*100).toFixed(2) : 0 }));
  console.log(`📊 Risk distribution computed: total=${total}, items=${JSON.stringify(items)}`);
  return res.status(200).json(new ApiResponse(200, { dimension: 'riskLevel', total, items }, 'Risk distribution'));
});

// Tool summary (average score & counts per tool)
export const adminScreeningToolSummary = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);
  const { institutionId } = req.query;
  const match = {};
  if (institutionId) match.institutionId = institutionId;
  const pipeline = [
    { $match: match },
    { $group: { _id: "$tool", count: { $sum: 1 }, avgScore: { $avg: "$totalScore" } } },
    { $sort: { _id: 1 } }
  ];
  const rows = await Screening.aggregate(pipeline);
  const tools = rows.map(r => ({ key: r._id, label: r._id, count: r.count, avgScore: +r.avgScore.toFixed(2) }));
  const total = rows.reduce((a,b) => a + b.count, 0);
  console.log(`📊 Tool summary computed: total=${total}, tools=${JSON.stringify(tools)}`);
  return res.status(200).json(new ApiResponse(200, { total, tools }, 'Tool summary'));
});
