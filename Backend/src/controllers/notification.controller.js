import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.model.js";

// Logger helpers for notifications
const log = (...args) => console.log("🔔 [Notification]", ...args);
const warn = (...args) => console.warn("⚠️ [Notification]", ...args);
const error = (...args) => console.error("❌ [Notification]", ...args);

export const listNotifications = asyncHandler(async (req, res) => {
  log("📥 Listing notifications for user", req.user?._id?.toString());
  const { read, type, page = 1, limit = 20 } = req.query;
  const filter = { userId: req.user._id };
  if (type) filter.type = type;
  if (read === "true") filter.readAt = { $ne: null };
  if (read === "false") filter.readAt = null;
  log("🔎 Filters applied:", { read, type });
  const numericLimit = Math.min(parseInt(limit) || 20, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const cursor = Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((numericPage - 1) * numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    Notification.countDocuments(filter)
  ]);
  log(`📦 Returning ${items.length} notifications (total: ${total}) page ${numericPage}`);
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Notifications fetched"));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  log("✉️ Mark single notification read", req.params?.id);
  const { id } = req.params;
  const notif = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { readAt: new Date() },
    { new: true }
  );
  if (!notif) throw new ApiError(404, "Notification not found");
  log("✅ Notification marked read", id);
  return res.status(200).json(new ApiResponse(200, notif, "Notification marked read"));
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  log("📨 Marking all notifications read for user", req.user?._id?.toString());
  await Notification.updateMany({ userId: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  log("✅ All notifications marked read");
  return res.status(200).json(new ApiResponse(200, {}, "All notifications marked read"));
});
