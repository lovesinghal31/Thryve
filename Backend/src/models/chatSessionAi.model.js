import mongoose, { Schema } from "mongoose";

const aiChatSessionSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ["student", "ai"],
        },
        text: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const AiChatSession = mongoose.model("AiChatSession", aiChatSessionSchema);
