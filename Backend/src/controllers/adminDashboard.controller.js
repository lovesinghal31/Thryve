import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Institute } from "../models/institue.model.js";
import { Resource } from "../models/resource.model.js";
import { Appointment } from "../models/appointment.model.js";
import { ChatRoom, ChatMessage } from "../models/chatsupport.model.js";
import { Screening } from "../models/screening.model.js";

// Admin Dashboard Statistics Controller

const getInstitueName = async () => {
  // logic to get institute name
    try {
    const institute = await Institute.findOne();
    return institute?.name || "Default Institute"; 
    } catch (error) {
    console.error("Error fetching institute:", error);
    return "Default Institute";
    }
};

const getTotalUsers = async () => {
  // logic to get total users 
  try {
    const totalUsers = await User.countDocuments();
    return totalUsers;
  } catch (error) {
    console.error("Error fetching total users:", error);
    return 0;
  }
};

const getActiveUsersDaily = async () => {
  // logic to get active users daily
  try {
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    return activeUsers;
  } catch (error) {
    console.error("Error fetching active users daily:", error);
    return 0;
  }
};

const getActiveUsersWeekly = async () => {
  // logic to get active users weekly
  try {
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    return activeUsers;
  } catch (error) {
    console.error("Error fetching active users weekly:", error);
    return 0;
  }
};

const getActiveUsersMonthly = async () => {
  // logic to get active users monthly
  try {
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    return activeUsers;
  } catch (error) {
    console.error("Error fetching active users monthly:", error);
    return 0;
  }
};

const getNewUsers = async () => {
  // logic to get new users 
  try {
    const newUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    return newUsers;
  } catch (error) {
    console.error("Error fetching new users:", error);
    return 0;
  }
};

const getReturningUsers = async () => {
  // logic to get returning users
  try {
    const returningUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    return returningUsers;
  } catch (error) {
    console.error("Error fetching returning users:", error);
    return 0;
  }
};

// ----------------------------- //

const getAverageSessionDuration = async () => {
  // logic to get average session duration
  try {
    const sessions = await Session.find();
    const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
    return totalDuration / sessions.length || 0;
  } catch (error) {
    console.error("Error fetching average session duration:", error);
    return 0;
  }
};

const getPercentageUsershowingImprovement = async () => {
  // logic to get percentage of users showing improvement
  try {
    const usersShowingImprovement = await User.countDocuments({ improvement: true });
    const totalUsers = await getTotalUsers();
    return (usersShowingImprovement / totalUsers) * 100 || 0;
  } catch (error) {
    console.error("Error fetching percentage of users showing improvement:", error);
    return 0;
  }
};

const getTotalScreenings = async () => {
  // logic to get total screenings
  try {
    const totalScreenings = await Screening.countDocuments();
    return totalScreenings;
  } catch (error) {
    console.error("Error fetching total screenings:", error);
    return 0;
  }
};

const getScreeningByTool = async () => {
  // logic to get screening by tool
  try {
    const screenings = await Screening.aggregate([
      {
        $group: {
          _id: "$tool",
          count: { $sum: 1 }
        }
      }
    ]);
    return screenings.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching screenings by tool:", error);
    return {};
  }
};

const getAverageScore = async () => {
  // logic to get average score
  try {
    const scores = await Score.find();
    const totalScores = scores.reduce((acc, score) => {
      acc.PHQ9 += score.PHQ9 || 0;
      acc.GAD7 += score.GAD7 || 0;
      return acc;
    }, { PHQ9: 0, GAD7: 0 });
    return {
      PHQ9: totalScores.PHQ9 / scores.length || 0,
      GAD7: totalScores.GAD7 / scores.length || 0
    };
  } catch (error) {
    console.error("Error fetching average score:", error);
    return { PHQ9: 0, GAD7: 0 };
  }
};

const getRiskLevelDistribution = async () => {
  // logic to get risk level distribution
  try {
    const riskLevels = await User.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 }
        }
      }
    ]);
    return riskLevels.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching risk level distribution:", error);
    return {};
  }
};

const getHighRiskFlags = async () => {
  // logic to get high risk flags
  try {
    const highRiskFlags = await User.countDocuments({ riskLevel: "high" });
    return highRiskFlags;
  } catch (error) {
    console.error("Error fetching high risk flags:", error);
    return 0;
  }
};

const getScreeningCompletionRate = async () => {
  // logic to get screening completion rate
  try {
    const completedScreenings = await Screening.countDocuments({ status: "completed" });
    const totalScreenings = await Screening.countDocuments();
    return (completedScreenings / totalScreenings) * 100 || 0;
  } catch (error) {
    console.error("Error fetching screening completion rate:", error);
    return 0;
  }
};

const getTotalAppointments = async () => {
  // logic to get total appointments
  try {
    const totalAppointments = await Appointment.countDocuments();
    return totalAppointments;
  } catch (error) {
    console.error("Error fetching total appointments:", error);
    return 0;
  }
};

const getAppointmentsByStatus = async () => {
  // logic to get appointments by status
  try {
    const appointments = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    return appointments.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    return {};
  }
};

const getAverageWaitTimeForAppointment = async () => {
  // logic to get average wait time for appointment
  try {
    const waitTimes = await Appointment.find().select("waitTime");
    const totalWaitTime = waitTimes.reduce((acc, curr) => acc + curr.waitTime, 0);
    return totalWaitTime / waitTimes.length || 0;
  } catch (error) {
    console.error("Error fetching average wait time for appointment:", error);
    return 0;
  }
};

const getCounselorLoadDistribution = async () => {
  // logic to get counselor load distribution
  try {
    const appointments = await Appointment.aggregate([
      {
        $group: {
          _id: "$counselorId",
          count: { $sum: 1 }
        }
      }
    ]);
    return appointments.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching counselor load distribution:", error);
    return {};
  }
};

const getAppointmentConversionRate = async () => {
  // logic to get appointment conversion rate
  try {
    const totalAppointments = await Appointment.countDocuments();
    const convertedAppointments = await Appointment.countDocuments({ status: "completed" });
    return (convertedAppointments / totalAppointments) * 100 || 0;
  } catch (error) {
    console.error("Error fetching appointment conversion rate:", error);
    return 0;
  }
};

const getEmergencyEscalations = async () => {
  // logic to get emergency escalations
  try {
    const emergencyEscalations = await Escalation.countDocuments({ type: "emergency" });
    return emergencyEscalations;
  } catch (error) {
    console.error("Error fetching emergency escalations:", error);
    return 0;
  }
};

const getTotalChatRooms = async () => {
  // logic to get total chat rooms
  try {
    const totalChatRooms = await ChatRoom.countDocuments();
    return totalChatRooms;
  } catch (error) {
    console.error("Error fetching total chat rooms:", error);
    return 0;
  }
};

const getTotalMessages = async () => {
  // logic to get total messages
  try {
    const totalMessages = await ChatMessage.countDocuments();
    return totalMessages;
  } catch (error) {
    console.error("Error fetching total messages:", error);
    return 0;
  }
};

const getAverageMessagesPerUser = async () => {
  // logic to get average messages per user
  try {
    const totalMessages = await getTotalMessages();
    const totalUsers = await getTotalUsers();
    return totalMessages / totalUsers || 0;
  } catch (error) {
    console.error("Error fetching average messages per user:", error);
    return 0;
  }
};

const getAverageResponseTimePeerSupport = async () => {
  // logic to get average response time for peer support
  try {
    const responseTimes = await PeerSupport.find().select("responseTime");
    const totalResponseTime = responseTimes.reduce((acc, curr) => acc + curr.responseTime, 0);
    return totalResponseTime / responseTimes.length || 0;
  } catch (error) {
    console.error("Error fetching average response time for peer support:", error);
    return 0;
  }
};

const getTotalResources = async () => {
  // logic to get total resources
  try {
    const totalResources = await Resource.countDocuments();
    return totalResources;
  } catch (error) {
    console.error("Error fetching total resources:", error);
    return 0;
  }
};

const getWeeklyRetentionRate = async () => {
  // logic to get weekly retention rate
  try {
    const totalUsers = await getTotalUsers();
    const retainedUsers = await getRetainedUsers();
    return (retainedUsers / totalUsers) * 100 || 0;
  } catch (error) {
    console.error("Error fetching weekly retention rate:", error);
    return 0;
  }
};

export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const instituteName = await getInstitueName();
  const totalUsers = await getTotalUsers();
  const activeUsersDaily = await getActiveUsersDaily();
  const activeUsersWeekly = await getActiveUsersWeekly();
  const activeUsersMonthly = await getActiveUsersMonthly();
  const newUsers = await getNewUsers();
  const returningUsers = await getReturningUsers();
  const averageSessionDuration = await getAverageSessionDuration();
  const percentageUsersShowingImprovement =
    await getPercentageUsershowingImprovement();
  const totalScreenings = await getTotalScreenings();
  const screeningsByTool = await getScreeningByTool();
  const averageScores = await getAverageScore();
  const riskLevelDistribution = await getRiskLevelDistribution();
  const highRiskFlags = await getHighRiskFlags();
  const screeningCompletionRate = await getScreeningCompletionRate();
  const totalAppointments = await getTotalAppointments();
  const appointmentsByStatus = await getAppointmentsByStatus();
  const averageWaitTimeForAppointment =
    await getAverageWaitTimeForAppointment();
  const counselorLoadDistribution = await getCounselorLoadDistribution();
  const appointmentConversionRate = await getAppointmentConversionRate();
  const emergencyEscalations = await getEmergencyEscalations();
  const totalChatRooms = await getTotalChatRooms();
  const totalMessages = await getTotalMessages();
  const averageMessagesPerUser = await getAverageMessagesPerUser();
  const averageResponseTimePeerSupport =
    await getAverageResponseTimePeerSupport();
  const totalResources = await getTotalResources();
  const weeklyRetentionRate = await getWeeklyRetentionRate();
  const response = {
    instituteName,
    totalUsers,
    activeUsersDaily,
    activeUsersWeekly,
    activeUsersMonthly,
    newUsers,
    returningUsers,
    averageSessionDuration,
    percentageUsersShowingImprovement,
    totalScreenings,
    screeningsByTool,
    averageScores,
    riskLevelDistribution,
    highRiskFlags,
    screeningCompletionRate,
    totalAppointments,
    appointmentsByStatus,
    averageWaitTimeForAppointment,
    counselorLoadDistribution,
    appointmentConversionRate,
    emergencyEscalations,
    totalChatRooms,
    totalMessages,
    averageMessagesPerUser,
    averageResponseTimePeerSupport,
    totalResources,
    weeklyRetentionRate,
  };
  // save to AdminDashboard collection
  //   const adminDashboard = await AdminDashboard.findOneAndUpdate(
  //     { instituteName },
  //     response,
  //     { upsert: true, new: true }
  //   );
  // for acutal implementation, uncomment above and remove below
  const adminDashboard = response;
  res
    .status(200)
    .json(
      new ApiResponse(200, "Admin dashboard stats fetched", adminDashboard)
    );
});
