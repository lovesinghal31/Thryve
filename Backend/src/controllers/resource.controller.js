import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Resource } from "../models/resource.model.js";

export const listCompletedResources = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, language } = req.query;
  const filter = { completedBy: req.user._id };
  if (type) filter.type = type;
  if (language) filter.language = language;
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
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Completed resources fetched"));
});

export const markResourceCompleted = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const resource = await Resource.findById(resourceId);
  if (!resource) throw new ApiError(404, "Resource not found");
  if (!resource.completedBy.some(u => u.toString() === req.user._id.toString())) {
    resource.completedBy.push(req.user._id);
    await resource.save();
  }
  return res.status(200).json(new ApiResponse(200, resource, "Resource marked completed"));
});
