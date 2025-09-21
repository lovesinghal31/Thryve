import mongoose, { Schema } from "mongoose";

// AdminDashboard analytics schema for a particular institute
const AdminDashboardSchema = new Schema(
  {
    // ========== Institute Reference ==========
    institutionId: { type: Schema.Types.ObjectId, ref: "Institute", required: true, index: true },
    instituteName: { type: String, required: true },

    // ========== User Collection ==========
    totalUsers: { type: Number, default: 0 },
  // Store 24 values for each hour of the day
  activeUsersDaily: { type: [Number], default: Array(24).fill(0) },
  // Store 7 values for each day of the week (0=Sunday)
  activeUsersWeekly: { type: [Number], default: Array(7).fill(0) },
  // Store 30 values for each day of the month (1-30)
  activeUsersMonthly: { type: [Number], default: Array(30).fill(0) },
    newUsers: { type: Number, default: 0 },
    returningUsers: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 }, // in minutes
    percentageUsersShowingImprovement: { type: Number, default: 0 }, // percentage

    // ========== Screening Collection ==========
    totalScreenings: { type: Number, default: 0 },
    screeningsByTool: {
      PHQ9: { type: Number, default: 0 },
      GAD7: { type: Number, default: 0 },
      GHQ: { type: Number, default: 0 },
    },
    averageScorePHQ9: { type: Number, default: 0 },
    averageScoreGAD7: { type: Number, default: 0 },
    riskLevelDistribution: {
      low: { type: Number, default: 0 },
      moderate: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
    },
    highRiskFlags: { type: Number, default: 0 },
    screeningCompletionRate: { type: Number, default: 0 }, // percentage

    // ========== Appointment Collection ==========
    totalAppointments: { type: Number, default: 0 },
    appointmentsByStatus: {
      booked: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
      noShow: { type: Number, default: 0 },
    },
    averageWaitTimeForAppointment: { type: Number, default: 0 }, // in hours
    counselorLoadDistribution: { type: Map, of: Number, default: {} }, // counselorId: count
    appointmentConversionRate: { type: Number, default: 0 }, // percentage
    emergencyEscalations: { type: Number, default: 0 },

    // ========== ChatRoom/ChatMessage Collection ==========
    totalChatRooms: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 },
    averageMessagesPerUser: { type: Number, default: 0 },
    averageResponseTimePeerSupport: { type: Number, default: 0 }, // in minutes

    // ========== Resource Collection ==========
    totalResources: { type: Number, default: 0 },

    // ========== Platform Health & Adoption (Mixed) ==========
    weeklyRetentionRate: { type: Number, default: 0 }, // percentage
  },
  { timestamps: true }
);

// Removed redundant single-field index on institutionId; path already has index:true
// Keeping only path-level index avoids Mongoose duplicate index warning.

export const AdminDashboard = mongoose.model(
  "AdminDashboard",
  AdminDashboardSchema
);
