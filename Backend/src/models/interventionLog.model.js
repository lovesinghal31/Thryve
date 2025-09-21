import mongoose, { Schema } from "mongoose";

// InterventionLog: audit trail for actions taken on elevated / high-risk cases.
// Supports analytics on response time, action effectiveness, and escalation pathways.
const interventionLogSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institute", required: true, index: true },
    relatedScreening: { type: Schema.Types.ObjectId, ref: "Screening" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // actor performing action
    actionType: {
      type: String,
      enum: [
        "flagged",
        "contacted-student",
        "scheduled-appointment",
        "escalated",
        "safety-plan",
        "resource-shared",
        "follow-up",
        "closed"
      ],
      required: true,
      index: true,
    },
    notes: { type: String, trim: true },
    meta: { type: Schema.Types.Mixed, default: {} }, // flexible extra fields
    escalated: { type: Boolean, default: false, index: true },
    resolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

interventionLogSchema.index({ studentId: 1, createdAt: -1 });
interventionLogSchema.index({ institutionId: 1, actionType: 1, createdAt: -1 });

export const InterventionLog = mongoose.model("InterventionLog", interventionLogSchema);
