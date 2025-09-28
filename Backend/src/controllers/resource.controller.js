import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Resource } from "../models/resource.model.js";

// Logger helpers for resources
const log = (...args) => console.log("📚 [Resource]", ...args);
const warn = (...args) => console.warn("⚠️ [Resource]", ...args);
const error = (...args) => console.error("❌ [Resource]", ...args);

export const listCompletedResources = asyncHandler(async (req, res) => {
  log("📥 Listing completed resources for user", req.user?._id?.toString());
  const { page = 1, limit = 20, type, language } = req.query;
  const filter = { completedBy: req.user._id };
  if (type) filter.type = type;
  if (language) filter.language = language;
  log("🔎 Filters:", { type, language });
  const numericLimit = Math.min(parseInt(limit) || 20, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const cursor = Resource.find(filter)
    .sort({ updatedAt: -1 })
    .skip((numericPage - 1) * numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    Resource.countDocuments(filter)
  ]);
  log(`📦 Returning ${items.length} resources (total: ${total}) page ${numericPage}`);
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Completed resources fetched"));
});

export const markResourceCompleted = asyncHandler(async (req, res) => {
  log("✅ Mark resource completed attempt", req.params?.resourceId);
  const { resourceId } = req.params;
  const resource = await Resource.findById(resourceId);
  if (!resource) throw new ApiError(404, "Resource not found");
  if (!resource.completedBy.some(u => u.toString() === req.user._id.toString())) {
    resource.completedBy.push(req.user._id);
    await resource.save();
    log("🆕 Resource completion recorded", resourceId);
  }
  else {
    log("ℹ️ Resource already marked completed", resourceId);
  }
  return res.status(200).json(new ApiResponse(200, resource, "Resource marked completed"));
});
