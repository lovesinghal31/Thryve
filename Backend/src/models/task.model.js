import mongoose, { Schema } from "mongoose";

// Task model: operational / intervention tasks assigned to staff or counselors.
// Supports linking to a target student or screening for traceability.
const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institute", required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    relatedUser: { type: Schema.Types.ObjectId, ref: "User", index: true }, // e.g. student needing follow-up
    relatedScreening: { type: Schema.Types.ObjectId, ref: "Screening" },
    dueDate: { type: Date, index: true },
    status: { type: String, enum: ["open", "in-progress", "completed", "blocked", "cancelled"], default: "open", index: true },
    priority: { type: String, enum: ["low", "normal", "high", "critical"], default: "normal", index: true },
    tags: [{ type: String, trim: true, index: true }],
    notes: { type: String, trim: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
taskSchema.index({ relatedUser: 1, createdAt: -1 });

export const Task = mongoose.model("Task", taskSchema);
