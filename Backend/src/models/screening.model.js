import mongoose, { Schema } from "mongoose";

// Screening captures standardized mental health assessment results.
// Enhancements:
// - Added institutionId for multi-tenant separation
// - Added status + completedAt to differentiate partial vs submitted
// - Added notes for counselor / system remarks
// - Indexes for analytics (studentId+tool+createdAt, institutionId+tool)
const screeningSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    tool: {
      type: String,
      enum: ["PHQ-9", "GAD-7", "GHQ"],
      required: true,
      index: true,
    },
    answers: [
      {
        question: String,
        score: Number,
      },
    ],
    totalScore: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "submitted",
      index: true,
    },
    completedAt: { type: Date, default: null },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

screeningSchema.index({ studentId: 1, tool: 1, createdAt: -1 });
screeningSchema.index({ institutionId: 1, tool: 1 });

export const Screening = mongoose.model("Screening", screeningSchema);
