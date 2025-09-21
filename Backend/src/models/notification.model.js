import mongoose, { Schema } from "mongoose";

// Notification model: user/system alerts (appointment updates, risk flags, tasks, etc.)
// Design notes:
// - userId: recipient (nullable for broadcast if needed)
// - type: categorizes notification semantics
// - meta: flexible JSON object for deep-linking
// - readAt: null means unread
// - institutionId: multi-tenant scoping
const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institute", required: true, index: true },
    type: {
      type: String,
      enum: [
        "system",
        "appointment",
        "screening",
        "chat",
        "resource",
        "task",
        "risk-alert",
        "general"
      ],
      default: "general",
      index: true,
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    meta: { type: Schema.Types.Mixed, default: {} }, // e.g. { appointmentId, screeningId }
    readAt: { type: Date, default: null, index: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal", index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, readAt: 1 });
notificationSchema.index({ institutionId: 1, type: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
