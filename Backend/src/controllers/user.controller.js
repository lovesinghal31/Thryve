import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js"
import { Screening } from "../models/screening.model.js";
import { Resource } from "../models/resource.model.js";
import { Notification } from "../models/notification.model.js";
import { Task } from "../models/task.model.js";
import { Idea } from "../models/idea.model.js";
import { ChatRoom, ChatMessage } from "../models/chatsupport.model.js";
import jwt from "jsonwebtoken";
import { otpStore } from "../utils/otpStore.js";
import sendEmail from "../utils/sendEmail.js";
import { Institute } from "../models/institue.model.js";
import { cookieOptions } from "../constants.js";
import { passwordResetStore } from "../utils/passwordResetStore.js";
import crypto from "crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

// to make the code for user to register
// fields required : username, email, pseudoname, password, institution, languagePreference, role
// first to check if any of these fields are missing or not
// then check if the username or email already exists
// if not then generate a otp and and it's expiry time to otpStore along with the user details
// then send the otp to the user's email
// finally send a response to the user that otp has been sent to their email
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    institutionId,
    role = "student",
    languagePreference = "en",
    pseudoname = null,
  } = req.body;

  // Check for missing fields
  console.log("🔍 Checking for missing fields...");
  const requiredFields = { email, username, password, institutionId, languagePreference, role };
  if (Object.values(requiredFields).some((v) => !v || (typeof v === "string" && v.trim() === ""))) {
    console.log("❌ Missing fields detected!");
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  // Check if user already exists
  console.log("🔎 Checking if user already exists...");
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    console.log("⚠️ User already exists!");
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "User with this email or username already exists"
        )
      );
  }

  // to get the institution from the institution id
  console.log("🏫 Fetching institution...");
  const institution = await Institute.findById(institutionId);
  if (!institution) {
    console.log("❌ Invalid institution ID!");
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid institution ID"));
  }

  const fetchedInstitutionId = institution._id;

  // Generate OTP and send email
  console.log("🔢 Generating OTP and storing user data...");
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(`Generated OTP: ${otp} (for debugging purposes)`); // In production, avoid logging sensitive info
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, {
    otp,
    userData: {
      username,
      email,
      password,
      institutionId: fetchedInstitutionId,
      role,
      languagePreference,
      pseudoname,
    },
    otpExpiry,
  });

  const message = `Your OTP for registration is ${otp}. It is valid for 10 minutes.`;
  console.log("📧 Sending OTP email...");
  await sendEmail({
    to: email,
    subject: "OTP for Registration",
    html: `<p>${message}</p>`,
  });

  // Send response
  console.log("✅ OTP sent to email!");
  return res
    .status(200)
    .json(new ApiResponse(200, { email }, "OTP sent to email"));
});

const verifyOtpAndCreateUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log("🔑 Verifying OTP and email...");
  if (!email || !otp) {
    console.log("❌ Email or OTP missing!");
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email and OTP are required"));
  }

  const storedData = otpStore.get(email);
  if (!storedData) {
    console.log("❌ No OTP request found for this email!");
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "No OTP request found for this email"));
  }
  // console the stored otp and the otp received from the user
  // console.log(`Stored OTP: ${storedData.otp}, Received OTP: ${otp}`);
  // compare the stored otp and the otp received from the user

  if (storedData.otp !== parseInt(otp)) {
    console.log("❌ Invalid OTP!");
    return res.status(400).json(new ApiResponse(400, {}, "Invalid OTP"));
  }

  if (Date.now() > storedData.otpExpiry) {
    console.log("⌛ OTP has expired!");
    otpStore.delete(email);
    return res.status(400).json(new ApiResponse(400, {}, "OTP has expired"));
  }

  const { userData } = storedData;
  console.log("👤 Creating new user...");
  const newUser = await User.create(userData);
  otpStore.delete(email);

  console.log("✅ User registered successfully!");
  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("🔑 Logging in user...");
  // Check for missing fields
  if (!email || !password) {
    console.log("❌ Email or password missing!");
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email and password are required"));
  }

  // Find user by email
  console.log("🔎 Looking up user by email...");
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    console.log("❌ Invalid email or password!");
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid email or password"));
  }

  // Generate tokens
  console.log("🔐 Generating access and refresh tokens...");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Update lastActive
  console.log("🕒 Updating lastActive timestamp...");
  user.lastActive = new Date();
  await user.save({ validateBeforeSave: false });

  // Fetch user data for response
  console.log("📦 Fetching user data for response...");
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -__v -lastActive"
  );

  // Send response
  console.log("✅ User logged in successfully!");
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("🚪 Logging out user...");
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  console.log("🧹 Clearing cookies and finishing logout...");
  return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  // Fetch user (exclude sensitive fields)
  const user = await User.findById(req.user._id)
    .select("-password -refreshToken -__v")
    .lean();
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  // Fetch institution
  const institution = await Institute.findById(user.institutionId).select("_id name address contactEmail contactPhone website").lean();

  // Parallel stats/related counts
  const [
    screeningCount,
    latestScreening,
    appointmentCount,
    completedResources,
    notificationUnread,
    myTasks,
    myIdeas,
    chatRoomCount,
    chatMessageCount,
  ] = await Promise.all([
    Screening.countDocuments({ studentId: user._id }),
    Screening.findOne({ studentId: user._id }).sort({ createdAt: -1 }).lean(),
    Appointment.countDocuments({ $or: [{ studentId: user._id }, { counselorId: user._id }] }),
    Resource.countDocuments({ completedBy: user._id }),
    Notification.countDocuments({ userId: user._id, readAt: null }),
    Task.countDocuments({ assignedTo: user._id }),
    Idea.countDocuments({ createdBy: user._id }),
    ChatRoom.countDocuments({ participants: user._id }),
    ChatMessage.countDocuments({ senderId: user._id }),
  ]);

  // Risk level (latest screening)
  const riskLevel = latestScreening ? latestScreening.riskLevel : null;

  // Presence (basic): online if lastActive within 5 minutes
  const lastActive = user.lastActive || null;
  const now = Date.now();
  const isOnline = lastActive ? (now - new Date(lastActive).getTime()) < 5 * 60 * 1000 : false;
  const onlineForMinutes = isOnline ? Math.floor((now - new Date(lastActive).getTime()) / 60000) : 0;

  // Normalize preferences & profile fields for older records
  const mergedPrefs = {
    notifications: {
      dailyReminders: user.preferences?.notifications?.dailyReminders ?? false,
      weeklySummary: user.preferences?.notifications?.weeklySummary ?? true,
    },
    privacy: {
      avatarVisible: user.preferences?.privacy?.avatarVisible ?? true,
    },
  };
  const year = user.year ?? new Date().getFullYear();
  const statusText = user.status ?? "";
  const thought = user.todaysThought ?? "";

  // Compose response
  const profile = {
    ...user,
    year,
    status: statusText,
    todaysThought: thought,
    preferences: mergedPrefs,
    institution,
    presence: { isOnline, onlineForMinutes },
    stats: {
      screeningCount,
      latestRiskLevel: riskLevel,
      appointmentCount,
      completedResources,
      unreadNotifications: notificationUnread,
      myTasks,
      myIdeas,
      chatRoomCount,
      chatMessageCount
    }
  };
  return res.status(200).json(new ApiResponse(200, profile, "User profile fetched successfully"));
});

// NOTE: Counselor availability + other appointment logic moved to appointment.controller.js

/*
  to be added later 
  refreshToken → Issue new token if using refresh flow.
  forgotPassword → Send reset link/OTP.
  resetPassword → Update password after OTP/verification.
  updatePassword → Change password when logged in.
  updateUserProfile → Update name, pseudonym, language preference, contact info.
  deleteUserAccount → Soft delete (or anonymize user).
*/


// ========== Additional Authentication & Session Controllers ==========

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incoming) throw new ApiError(401, "Refresh token missing");
  let decoded;
  try {
    decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const user = await User.findById(decoded._id);
  if (!user || !user.refreshToken || user.refreshToken !== incoming) {
    throw new ApiError(401, "Refresh token expired or revoked");
  }
  const accessToken = user.generateAccessToken();
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

const revokeAllSessions = asyncHandler(async (req, res) => {
  const { id } = req.params; // admin or self route
  if (req.user.role !== "admin" && req.user.role !== "superadmin" && req.user._id.toString() !== id) {
    throw new ApiError(403, "Not authorized to revoke sessions");
  }
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
  console.log("🧹 All sessions revoked for user", id);
  return res.status(200).json(new ApiResponse(200, {}, "All sessions revoked"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  const user = await User.findOne({ email });
  if (!user) {
    // do not reveal existence
    return res.status(200).json(new ApiResponse(200, {}, "If the email exists, a reset link/OTP was sent"));
  }
  const token = crypto.randomBytes(20).toString("hex");
  const expiry = Date.now() + 15 * 60 * 1000; // 15 min
  passwordResetStore.set(email, { token, expiry, attempts: 0 });
  const resetMessage = `Your password reset token is ${token}. It expires in 15 minutes.`;
  try {
    await sendEmail({ to: email, subject: "Password Reset", html: `<p>${resetMessage}</p>` });
  } catch (e) {
    passwordResetStore.delete(email);
    throw new ApiError(500, "Failed to send reset email");
  }
  return res.status(200).json(new ApiResponse(200, {}, "Reset instructions sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (![email, token, newPassword].every(Boolean)) throw new ApiError(400, "All fields required");
  const record = passwordResetStore.get(email);
  if (!record) throw new ApiError(400, "Reset token invalid");
  if (Date.now() > record.expiry) {
    passwordResetStore.delete(email);
    throw new ApiError(400, "Reset token expired");
  }
  if (record.token !== token) {
    record.attempts += 1;
    if (record.attempts > 5) passwordResetStore.delete(email);
    throw new ApiError(400, "Invalid reset token");
  }
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");
  user.password = newPassword; // will trigger pre-save hash
  user.refreshToken = null; // force re-login everywhere
  await user.save();
  passwordResetStore.delete(email);
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successful"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, "Both current and new password required");
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  const valid = await user.isPasswordCorrect(currentPassword);
  if (!valid) throw new ApiError(401, "Current password incorrect");
  if (currentPassword === newPassword) throw new ApiError(400, "New password must be different");
  user.password = newPassword;
  user.refreshToken = null; // invalidate existing refresh token
  await user.save();
  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ========== Profile & Preferences Controllers ==========

const updateUserProfile = asyncHandler(async (req, res) => {
  const { pseudoname, languagePreference, avatarUrl, year, username, status, todaysThought } = req.body;
  const updates = {};
  if (pseudoname !== undefined) updates.pseudoname = (pseudoname ?? "").toString().trim() || null;
  if (languagePreference) updates.languagePreference = languagePreference;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl || null;
  if (year !== undefined) updates.year = Number(year);
  if (status !== undefined) updates.status = (status ?? "").toString().trim();
  if (todaysThought !== undefined) updates.todaysThought = (todaysThought ?? "").toString().trim();

  // username change (lowercased like schema)
  if (username !== undefined) updates.username = (username ?? "").toString().trim().toLowerCase();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json(new ApiResponse(400, {}, "No valid fields to update"));
  }

  // If username is changing, ensure it's unique
  if (updates.username) {
    const exists = await User.findOne({ _id: { $ne: req.user._id }, username: updates.username });
    if (exists) throw new ApiError(400, "Username already taken");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

const getPublicUserSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("username pseudoname role avatarUrl institutionId");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "Public user summary"));
});

const updateUserPreferences = asyncHandler(async (req, res) => {
  const { languagePreference, dailyReminders, weeklySummary, avatarVisible } = req.body;
  const updates = {};
  if (languagePreference) updates.languagePreference = languagePreference;
  if (typeof dailyReminders === "boolean") updates["preferences.notifications.dailyReminders"] = dailyReminders;
  if (typeof weeklySummary === "boolean") updates["preferences.notifications.weeklySummary"] = weeklySummary;
  if (typeof avatarVisible === "boolean") updates["preferences.privacy.avatarVisible"] = avatarVisible;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json(new ApiResponse(400, {}, "No preferences provided"));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  ).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "Preferences updated"));
});

// For actual file uploads you'd parse multipart/form-data; here we accept a prepared URL.
const uploadAvatar = asyncHandler(async (req, res) => {
  const { avatarUrl } = req.body;
  if (!avatarUrl) throw new ApiError(400, "avatarUrl required");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl },
    { new: true }
  ).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "Avatar updated"));
});

const deleteAvatar = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: null },
    { new: true }
  ).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "Avatar removed"));
});

// ========== Admin: List Users (with filters & pagination) ==========
const listUsers = asyncHandler(async (req, res) => {
  if (!["admin", "superadmin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized");
  }
  const {
    page = 1,
    limit = 20,
    role,
    q,
    institutionId,
  } = req.query;
  const numericLimit = Math.min(parseInt(limit) || 20, 100);
  const numericPage = Math.max(parseInt(page) || 1, 1);
  const filter = {};
  if (institutionId) filter.institutionId = institutionId;
  if (role) filter.role = role;
  if (q) {
    filter.$or = [
      { username: { $regex: q, $options: "i" } },
      { pseudoname: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }
  const cursor = User.find(filter).select("-password -refreshToken").sort({ createdAt: -1 })
    .skip((numericPage - 1) * numericLimit)
    .limit(numericLimit);
  const [items, total] = await Promise.all([
    cursor,
    User.countDocuments(filter)
  ]);
  return res.status(200).json(new ApiResponse(200, {
    items,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit)
  }, "Users fetched"));
});

// ========== Activity Summary (user-centric cross-domain helper) ==========
const getUserActivitySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [screeningCount, appointmentCount, completedResources] = await Promise.all([
    Screening.countDocuments({ studentId: userId }),
    Appointment.countDocuments({ $or: [{ studentId: userId }, { counselorId: userId }] }),
    Resource.countDocuments({ completedBy: userId }),
  ]);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        screenings: screeningCount,
        appointments: appointmentCount,
        completedResources,
      },
      "Activity summary fetched"
    )
  );
});

export {
  registerUser,
  verifyOtpAndCreateUser,
  loginUser,
  logoutUser,
  getUserProfile,
  refreshAccessToken,
  revokeAllSessions,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserProfile,
  getPublicUserSummary,
  updateUserPreferences,
  uploadAvatar,
  deleteAvatar,
  listUsers,
  getUserActivitySummary,
};
