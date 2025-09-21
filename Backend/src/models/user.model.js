import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// User schema captures authentication + institutional linkage + preferences.
// Added enhancements:
// - Expanded roles to support platform needs
// - Optional pseudoname for anonymity in peer features
// - Indexes for frequent queries (institutionId+role, lastActive)
// - Consistent lowercasing & trimming.
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must be at most 20 characters long"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    // Optional display name used in anonymous / semi-anonymous contexts
    pseudoname: {
      type: String,
      trim: true,
      maxlength: [40, "Pseudoname must be at most 40 characters long"],
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: [
        "student",
        "counselor",
        "admin",
        "moderator",
        "staff",
        "superadmin"
      ],
      default: "student",
      index: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    lastActive: {
      type: Date,
      default: null,
    },
    languagePreference: { type: String, enum: ["en", "hi"], default: "en" },
    avatarUrl: { type: String, default: null },
  // Profile & Preferences additions for frontend profile section
  year: { type: Number, min: 1900, max: 3000, default: () => new Date().getFullYear() },
    status: { type: String, trim: true, maxlength: 160, default: "Every sunrise is a new chance, to grow, to learn, and to become a better me." },
    todaysThought: { type: String, trim: true, maxlength: 280, default: "The journey of a thousand miles begins with a single step." },
    preferences: {
      notifications: {
        dailyReminders: { type: Boolean, default: false },
        weeklySummary: { type: Boolean, default: true },
      },
      privacy: {
        avatarVisible: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

// Compound & auxiliary indexes for common access patterns
userSchema.index({ institutionId: 1, role: 1 });
userSchema.index({ lastActive: -1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
