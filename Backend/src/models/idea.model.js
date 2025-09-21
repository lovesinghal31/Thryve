import mongoose, { Schema } from "mongoose";

// Idea model: crowdsourced improvements / feature suggestions / initiatives
// Supports lightweight engagement (upvotes) & moderation workflow.
const ideaSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true, index: true }],
    status: {
      type: String,
      enum: ["open", "under-review", "accepted", "rejected", "implemented"],
      default: "open",
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institute", required: true, index: true },
    upvotes: { type: Number, default: 0, index: true },
    commentsCount: { type: Number, default: 0 },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ideaSchema.index({ institutionId: 1, status: 1, createdAt: -1 });
ideaSchema.index({ upvotes: -1 });

export const Idea = mongoose.model("Idea", ideaSchema);
