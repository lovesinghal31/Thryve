import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Screening } from "../models/screening.model.js";

// Get paginated screenings for the authenticated user
export const getMyScreenings = asyncHandler(async (req, res) => {
  const { tool, riskLevel, status, page = 1, limit = 20 } = req.query;
  const filter = { studentId: req.user._id };
  if (tool) filter.tool = tool;
  if (riskLevel) filter.riskLevel = riskLevel;
  if (status) filter.status = status;
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
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Screenings fetched"));
});

// Get latest screening (optionally by tool)
export const getMyLatestScreening = asyncHandler(async (req, res) => {
  const { tool } = req.query;
  const filter = { studentId: req.user._id };
  if (tool) filter.tool = tool;
  const latest = await Screening.findOne(filter).sort({ createdAt: -1 });
  if (!latest) return res.status(404).json(new ApiResponse(404, {}, "No screening found"));
  return res.status(200).json(new ApiResponse(200, latest, "Latest screening fetched"));
});
