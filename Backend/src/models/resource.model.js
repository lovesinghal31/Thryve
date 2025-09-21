import mongoose, { Schema } from "mongoose";

// Resources represent educational / supportive content items.
// Enhancements: institute scoping, tags, description, indexing engagement stats.
const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["article", "video", "audio", "guide"],
      required: true,
      index: true,
    },
    language: {
      type: String,
      default: "en",
      index: true,
    },
    description: { type: String, trim: true },
    url: {
      type: String,
      required: true,
    },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    tags: [{ type: String, trim: true, index: true }],
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    completedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

ResourceSchema.index({ institutionId: 1, type: 1, language: 1 });

export const Resource = mongoose.model("Resource", ResourceSchema);
