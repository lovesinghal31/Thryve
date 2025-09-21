import mongoose, { Schema } from "mongoose";

// ChatRoom: container for chat sessions (peer support / counseling groups)
const ChatRoomSchema = new Schema(
  {
    name: { type: String, trim: true },
    type: {
      type: String,
      enum: ["one-to-one", "group"],
      default: "one-to-one",
      index: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    institute: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    language: { type: String, enum: ["en", "hi"], default: "en", index: true },
    lastMessageAt: { type: Date, default: null, index: true },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ChatRoomSchema.index({ institute: 1, type: 1, archived: 1 });
ChatRoomSchema.index({ participants: 1 });

const ChatMessageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    language: { type: String, enum: ["en", "hi"], default: "en" },
    anonymous: {
      type: Boolean,
      default: false,
      index: true,
    },
    flagged: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedFlag: {
      type: Boolean,
      default: false,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ roomId: 1, createdAt: -1 });

export const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
export const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
