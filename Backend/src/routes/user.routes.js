import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public / unauthenticated
router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtpAndCreateUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// secure routes
// Authenticated user routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/profile").patch(verifyJWT, updateUserProfile);
router.route("/preferences").patch(verifyJWT, updateUserPreferences);
router.route("/avatar").post(verifyJWT, uploadAvatar);
router.route("/avatar").delete(verifyJWT, deleteAvatar);
router.route("/public/:id").get(getPublicUserSummary);

// Admin / elevated
router.route("/:id/revoke-sessions").post(verifyJWT, revokeAllSessions);

// Admin user listing
router.route("/").get(verifyJWT, listUsers);

// Activity summary (user-centric)
router.route("/activity/summary").get(verifyJWT, getUserActivitySummary);

export default router;
