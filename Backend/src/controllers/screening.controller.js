import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Screening } from "../models/screening.model.js";

// Logger helpers for screenings
const log = (...args) => console.log("🧪 [Screening]", ...args);
const warn = (...args) => console.warn("⚠️ [Screening]", ...args);
const error = (...args) => console.error("❌ [Screening]", ...args);

// Get paginated screenings for the authenticated user
export const getMyScreenings = asyncHandler(async (req, res) => {
  log("📥 Fetching screenings for user", req.user?._id?.toString());
  const { tool, riskLevel, status, page = 1, limit = 20 } = req.query;
  const filter = { studentId: req.user._id };
  if (tool) filter.tool = tool;
  if (riskLevel) filter.riskLevel = riskLevel;
  if (status) filter.status = status;
  log("🔎 Filters:", { tool, riskLevel, status });
  const numericLimit = Math.min(parseInt(limit) || 20, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const cursor = Screening.find(filter)
    .sort({ createdAt: -1 })
    .skip((numericPage - 1) * numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    Screening.countDocuments(filter)
  ]);
  log(`📦 Returning ${items.length} screenings (total: ${total}) page ${numericPage}`);
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Screenings fetched"));
});

// Get latest screening (optionally by tool)
export const getMyLatestScreening = asyncHandler(async (req, res) => {
  log("🕒 Fetching latest screening for user", req.user?._id?.toString());
  const { tool } = req.query;
  const filter = { studentId: req.user._id };
  if (tool) filter.tool = tool;
  const latest = await Screening.findOne(filter).sort({ createdAt: -1 });
  if (!latest) return res.status(404).json(new ApiResponse(404, {}, "No screening found"));
  log("✅ Latest screening found", latest._id.toString());
  return res.status(200).json(new ApiResponse(200, latest, "Latest screening fetched"));
});
