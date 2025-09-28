import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// NOTE: For testing mode we are not importing models to avoid real DB calls.
// Original model imports commented out below. Uncomment when restoring real logic.
// import { User } from "../models/user.model.js";
// import { Institute } from "../models/institue.model.js";
// import { Resource } from "../models/resource.model.js";
// import { Appointment } from "../models/appointment.model.js";
// import { ChatRoom, ChatMessage } from "../models/chatsupport.model.js";
// import { Screening } from "../models/screening.model.js";

// Random helpers for test data
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, decimals = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Debug logger (enabled when process.env.DEBUG_DASHBOARD === 'true')
const debugEnabled = process.env.DEBUG_DASHBOARD === "true";
const prefix = "📊 [AdminDashboard]";
const debugLog = (...args) => {
  if (debugEnabled) console.log(prefix, ...args);
};

// Admin Dashboard Statistics Controller

const getInstitueName = async () => {
  // TEST STUB: returning random demo institute name.
  const demoNames = [
    "Aurora Institute",
    "Zenith College",
    "Horizon University",
    "Pioneer Academy",
  ];
  const val = demoNames[randInt(0, demoNames.length - 1)];
  debugLog("getInstitueName ->", val);
  return val;
};

const getTotalUsers = async () => {
  const v = randInt(80, 500);
  debugLog("getTotalUsers ->", v);
  return v;
};

const getActiveUsersDaily = async () => {
  const v = randInt(10, 120);
  debugLog("getActiveUsersDaily ->", v);
  return v;
};

const getActiveUsersWeekly = async () => {
  const v = randInt(60, 300);
  debugLog("getActiveUsersWeekly ->", v);
  return v;
};

const getActiveUsersMonthly = async () => {
  const v = randInt(150, 800);
  debugLog("getActiveUsersMonthly ->", v);
  return v;
};

const getNewUsers = async () => {
  const v = randInt(5, 80);
  debugLog("getNewUsers ->", v);
  return v;
};

const getReturningUsers = async () => {
  const v = randInt(10, 150);
  debugLog("getReturningUsers ->", v);
  return v;
};

// ----------------------------- //

const getAverageSessionDuration = async () => {
  const v = randFloat(3, 25, 1);
  debugLog("getAverageSessionDuration ->", v);
  return v;
};

const getPercentageUsershowingImprovement = async () => {
  const v = randFloat(5, 60, 1);
  debugLog("getPercentageUsershowingImprovement ->", v);
  return v;
};

const getTotalScreenings = async () => {
  const v = randInt(20, 400);
  debugLog("getTotalScreenings ->", v);
  return v;
};

const getScreeningByTool = async () => {
  const v = { PHQ9: randInt(5, 120), GAD7: randInt(5, 120) };
  debugLog("getScreeningByTool ->", v);
  return v;
};

const getAverageScore = async () => {
  const v = { PHQ9: randFloat(0, 9, 1), GAD7: randFloat(0, 9, 1) };
  debugLog("getAverageScore ->", v);
  return v;
};

const getRiskLevelDistribution = async () => {
  const v = {
    low: randInt(20, 200),
    medium: randInt(5, 80),
    high: randInt(0, 30),
  };
  debugLog("getRiskLevelDistribution ->", v);
  return v;
};

const getHighRiskFlags = async () => {
  const v = randInt(0, 30);
  debugLog("getHighRiskFlags ->", v);
  return v;
};

const getScreeningCompletionRate = async () => {
  const v = randFloat(30, 95, 1);
  debugLog("getScreeningCompletionRate ->", v);
  return v;
};

const getTotalAppointments = async () => {
  const v = randInt(10, 300);
  debugLog("getTotalAppointments ->", v);
  return v;
};

const getAppointmentsByStatus = async () => {
  const v = {
    booked: randInt(5, 120),
    completed: randInt(5, 80),
    cancelled: randInt(0, 40),
  };
  debugLog("getAppointmentsByStatus ->", v);
  return v;
};

const getAverageWaitTimeForAppointment = async () => {
  const v = randFloat(0.5, 12, 1);
  debugLog("getAverageWaitTimeForAppointment ->", v);
  return v;
};

const getCounselorLoadDistribution = async () => {
  const v = { demoCounselorA: randInt(1, 40), demoCounselorB: randInt(1, 40) };
  debugLog("getCounselorLoadDistribution ->", v);
  return v;
};

const getAppointmentConversionRate = async () => {
  const v = randFloat(5, 70, 1);
  debugLog("getAppointmentConversionRate ->", v);
  return v;
};

const getEmergencyEscalations = async () => {
  const v = randInt(0, 15);
  debugLog("getEmergencyEscalations ->", v);
  return v;
};

const getTotalChatRooms = async () => {
  const v = randInt(1, 50);
  debugLog("getTotalChatRooms ->", v);
  return v;
};

const getTotalMessages = async () => {
  const v = randInt(50, 2000);
  debugLog("getTotalMessages ->", v);
  return v;
};

const getAverageMessagesPerUser = async () => {
  const v = randFloat(1, 25, 1);
  debugLog("getAverageMessagesPerUser ->", v);
  return v;
};

const getAverageResponseTimePeerSupport = async () => {
  const v = randFloat(0.2, 6, 1);
  debugLog("getAverageResponseTimePeerSupport ->", v);
  return v;
};

const getTotalResources = async () => {
  const v = randInt(10, 120);
  debugLog("getTotalResources ->", v);
  return v;
};

const getWeeklyRetentionRate = async () => {
  const v = randFloat(20, 90, 1);
  debugLog("getWeeklyRetentionRate ->", v);
  return v;
};

export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  debugLog("🚀 Generating admin dashboard stats...");

  // LEGACY (flat) response if requested
  if (req.query.legacy === "true") {
    debugLog("↩️ Using legacy flat format");
    const instituteName = await getInstitueName();
    const payload = {
      instituteName,
      totalUsers: await getTotalUsers(),
      activeUsersDaily: await getActiveUsersDaily(),
      activeUsersWeekly: await getActiveUsersWeekly(),
      activeUsersMonthly: await getActiveUsersMonthly(),
      newUsers: await getNewUsers(),
      returningUsers: await getReturningUsers(),
      averageSessionDuration: await getAverageSessionDuration(),
      percentageUsersShowingImprovement:
        await getPercentageUsershowingImprovement(),
      totalScreenings: await getTotalScreenings(),
      screeningsByTool: await getScreeningByTool(),
      averageScores: await getAverageScore(),
      riskLevelDistribution: await getRiskLevelDistribution(),
      highRiskFlags: await getHighRiskFlags(),
      screeningCompletionRate: await getScreeningCompletionRate(),
      totalAppointments: await getTotalAppointments(),
      appointmentsByStatus: await getAppointmentsByStatus(),
      averageWaitTimeForAppointment: await getAverageWaitTimeForAppointment(),
      counselorLoadDistribution: await getCounselorLoadDistribution(),
      appointmentConversionRate: await getAppointmentConversionRate(),
      emergencyEscalations: await getEmergencyEscalations(),
      totalChatRooms: await getTotalChatRooms(),
      totalMessages: await getTotalMessages(),
      averageMessagesPerUser: await getAverageMessagesPerUser(),
      averageResponseTimePeerSupport: await getAverageResponseTimePeerSupport(),
      totalResources: await getTotalResources(),
      weeklyRetentionRate: await getWeeklyRetentionRate(),
    };
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "Admin dashboard stats (legacy)"));
  }

  // Helper to build dynamic date ranges relative to "today"
  const today = new Date();
  const iso = (d) => d.toISOString().split("T")[0];
  const startOfMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)
  );
  const periodRange = `${iso(startOfMonth)}/${iso(today)}`; // e.g. 2025-09-01/2025-09-27
  // comparison: previous same-length window ending day before startOfMonth
  const daysInCurrent = Math.ceil((today - startOfMonth) / 86400000) + 1; // inclusive
  const comparisonEnd = new Date(startOfMonth.getTime() - 86400000);
  const comparisonStart = new Date(
    comparisonEnd.getTime() - (daysInCurrent - 1) * 86400000
  );
  const comparisonRange = `${iso(comparisonStart)}/${iso(comparisonEnd)}`;

  // Build synthetic totals using existing random helpers
  const totalUsers = (await getTotalUsers()) + randInt(1000, 4500); // broaden range
  const newUsers = (await getNewUsers()) + randInt(50, 400);
  const returningUsers = (await getReturningUsers()) + randInt(500, 2500);
  const activeUsersDaily = (await getActiveUsersDaily()) + randInt(200, 800);
  const activeUsersWeekly = (await getActiveUsersWeekly()) + randInt(800, 2500);
  const activeUsersMonthly =
    (await getActiveUsersMonthly()) + randInt(1500, 4000);
  const averageSessionDurationSec = Math.round(
    (await getAverageSessionDuration()) * 60 + randInt(60, 900)
  ); // convert minutes-ish to seconds
  const weeklyRetentionRate = parseFloat(
    ((await getWeeklyRetentionRate()) / 100).toFixed(2)
  );
  const percentageUsersShowingImprovement = parseFloat(
    ((await getPercentageUsershowingImprovement()) / 100).toFixed(2)
  );
  const highRiskFlags = (await getHighRiskFlags()) + randInt(5, 40);
  const emergencyEscalations = await getEmergencyEscalations();

  // DAILY ACTIVE USERS (last 7 days)
  const days = 7;
  const dailySeries = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today.getTime() - (days - 1 - i) * 86400000);
    return { date: iso(d), value: randInt(480, 560) };
  });

  // Engagement multi-series (subset of first 3 days of dailySeries for demo)
  const engagementMulti = {
    granularity: "day",
    series: [
      {
        key: "activeUsers",
        label: "Active Users",
        color: "#6366f1",
        points: dailySeries
          .slice(0, 3)
          .map((p) => ({ date: p.date, value: p.value })),
      },
      {
        key: "newUsers",
        label: "New Users",
        color: "#10b981",
        points: dailySeries
          .slice(0, 3)
          .map((p) => ({ date: p.date, value: randInt(20, 40) })),
      },
      {
        key: "returningUsers",
        label: "Returning Users",
        color: "#f59e0b",
        points: dailySeries
          .slice(0, 3)
          .map((p) => ({ date: p.date, value: randInt(450, 520) })),
      },
    ],
  };

  // Risk distribution
  const riskLow = randInt(1500, 2000);
  const riskModerate = randInt(800, 1200);
  const riskHigh = randInt(300, 450);
  const riskCritical = highRiskFlags; // reuse
  const riskTotal = riskLow + riskModerate + riskHigh + riskCritical;

  // Counselor load
  const counselorLoad = [
    {
      key: "c_101",
      label: "Dr. Mehra",
      activeClients: randInt(25, 35),
      openAppointments: randInt(2, 7),
    },
    {
      key: "c_102",
      label: "A. Singh",
      activeClients: randInt(22, 33),
      openAppointments: randInt(1, 6),
    },
    {
      key: "c_103",
      label: "R. Patel",
      activeClients: randInt(20, 30),
      openAppointments: randInt(1, 6),
    },
  ];

  // Appointments weekly status (4 recent weeks categories)
  const weekCategories = Array.from({ length: 4 }).map((_, i) => {
    const ref = new Date(today.getTime() - (3 - i) * 7 * 86400000);
    const oneJan = new Date(Date.UTC(ref.getUTCFullYear(), 0, 1));
    const week = Math.ceil(
      ((ref - oneJan) / 86400000 + oneJan.getUTCDay() + 1) / 7
    );
    return `${ref.getUTCFullYear()}-W${week}`;
  });
  const seriesAppointments = {
    granularity: "week",
    categories: weekCategories,
    series: [
      {
        key: "scheduled",
        label: "Scheduled",
        values: weekCategories.map(() => randInt(40, 60)),
      },
      {
        key: "completed",
        label: "Completed",
        values: weekCategories.map(() => randInt(32, 55)),
      },
      {
        key: "cancelled",
        label: "Cancelled",
        values: weekCategories.map(() => randInt(3, 8)),
      },
      {
        key: "noShow",
        label: "No Show",
        values: weekCategories.map(() => randInt(2, 5)),
      },
    ],
  };

  // Funnel stages
  const visited = randInt(3800, 4500);
  const screenStarted = randInt(1700, 2100);
  const screenCompleted = randInt(1400, 1700);
  const appointmentBooked = randInt(600, 750);
  const attendedSession = Math.min(appointmentBooked, randInt(520, 620));
  const conversionRate = parseFloat((attendedSession / visited).toFixed(3));

  const funnel = {
    period: periodRange,
    stages: [
      { key: "visited", label: "Visited Platform", value: visited },
      {
        key: "screenStarted",
        label: "Screening Started",
        value: screenStarted,
      },
      {
        key: "screenCompleted",
        label: "Screening Completed",
        value: screenCompleted,
      },
      {
        key: "appointmentBooked",
        label: "Appointment Booked",
        value: appointmentBooked,
      },
      {
        key: "attendedSession",
        label: "Session Attended",
        value: attendedSession,
      },
    ],
    conversionRate,
  };

  // Retention cohorts (simplified two cohorts)
  const retention = {
    metric: "weeklyRetention",
    cohorts: [
      {
        cohort: "2025-W30",
        start: "2025-07-21",
        size: randInt(180, 230),
        weeks: [
          { weekOffset: 0, rate: 1.0 },
          {
            weekOffset: 1,
            rate: parseFloat(randFloat(0.55, 0.7, 2).toFixed(2)),
          },
          {
            weekOffset: 2,
            rate: parseFloat(randFloat(0.48, 0.6, 2).toFixed(2)),
          },
          {
            weekOffset: 3,
            rate: parseFloat(randFloat(0.4, 0.5, 2).toFixed(2)),
          },
        ],
      },
      {
        cohort: "2025-W31",
        start: "2025-07-28",
        size: randInt(170, 220),
        weeks: [
          { weekOffset: 0, rate: 1.0 },
          {
            weekOffset: 1,
            rate: parseFloat(randFloat(0.58, 0.7, 2).toFixed(2)),
          },
          {
            weekOffset: 2,
            rate: parseFloat(randFloat(0.5, 0.6, 2).toFixed(2)),
          },
        ],
      },
    ],
  };

  // Screening tools summary
  const screeningTools = {
    period: periodRange.split("/")[0].slice(0, 7),
    summary: {
      totalScreenings: (await getTotalScreenings()) + randInt(2000, 3500),
      averageCompletionRate: parseFloat(
        ((await getScreeningCompletionRate()) / 100).toFixed(2)
      ),
    },
    tools: [
      {
        key: "phq9",
        label: "PHQ-9",
        count: randInt(800, 1000),
        avgScore: parseFloat(randFloat(6, 9, 1).toFixed(1)),
        severityDistribution: [
          { range: "0-4", count: randInt(200, 400) },
          { range: "5-9", count: randInt(200, 350) },
          { range: "10-14", count: randInt(150, 230) },
          { range: "15-19", count: randInt(70, 110) },
          { range: "20-27", count: randInt(20, 45) },
        ],
      },
      {
        key: "gad7",
        label: "GAD-7",
        count: randInt(700, 850),
        avgScore: parseFloat(randFloat(5, 7, 1).toFixed(1)),
      },
      {
        key: "who5",
        label: "WHO-5",
        count: randInt(500, 600),
        avgScore: parseFloat(randFloat(12, 15, 1).toFixed(1)),
      },
    ],
  };

  // Chat activity (3 hourly sample points)
  const baseHour = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    9
  );
  const chatActivity = {
    granularity: "hour",
    timezone: "UTC",
    data: [0, 1, 2].map((h) => {
      const ts = new Date(baseHour + h * 3600000).toISOString();
      return {
        timestamp: ts,
        messages: randInt(40, 65),
        uniqueUsers: randInt(15, 30),
      };
    }),
    peakHour: new Date(baseHour + randInt(3, 10) * 3600000).toISOString(),
  };

  // Top counselors
  const topCounselors = {
    metric: "appointmentsCompleted",
    period: periodRange.split("/")[0].slice(0, 7),
    items: [
      {
        id: "c_101",
        label: "Dr. Mehra",
        value: randInt(90, 120),
        avgSatisfaction: parseFloat(randFloat(4.4, 4.8, 1).toFixed(1)),
      },
      {
        id: "c_102",
        label: "A. Singh",
        value: randInt(85, 115),
        avgSatisfaction: parseFloat(randFloat(4.3, 4.7, 1).toFixed(1)),
      },
      {
        id: "c_103",
        label: "N. Rao",
        value: randInt(80, 105),
        avgSatisfaction: parseFloat(randFloat(4.2, 4.6, 1).toFixed(1)),
      },
    ],
  };

  // Score trend by risk (3 weeks series for PHQ9)
  const scoreTrendByRisk = {
    tool: "phq9",
    granularity: "week",
    series: ["low", "moderate", "high"].map((level) => {
      const base = level === "low" ? 2 : level === "moderate" ? 8.3 : 15;
      return {
        riskLevel: level,
        points: [0, 1, 2].map((offset) => {
          const ref = new Date(today.getTime() - (2 - offset) * 7 * 86400000);
          const oneJan = new Date(Date.UTC(ref.getUTCFullYear(), 0, 1));
          const week = Math.ceil(
            ((ref - oneJan) / 86400000 + oneJan.getUTCDay() + 1) / 7
          );
          return {
            week: `${ref.getUTCFullYear()}-W${week}`,
            avgScore: parseFloat(
              randFloat(base - 0.4, base + 0.4, 1).toFixed(1)
            ),
          };
        }),
      };
    }),
  };

  // Compose nested structure
  const data = {
    summary: {
      period: { range: periodRange, comparisonRange },
      totals: {
        totalUsers,
        newUsers,
        returningUsers,
        activeUsersDaily,
        activeUsersWeekly,
        activeUsersMonthly,
        averageSessionDurationSec,
        weeklyRetentionRate,
        percentageUsersShowingImprovement,
      },
      flags: { highRiskFlags, emergencyEscalations },
    },
    timeseries: {
      daily_active_users: {
        metric: "daily_active_users",
        granularity: "day",
        series: dailySeries,
      },
      engagement_multi: engagementMulti,
    },
    distributions: {
      riskLevel: {
        dimension: "riskLevel",
        period: periodRange.split("/")[0].slice(0, 7),
        items: [
          { key: "low", label: "Low", value: riskLow },
          { key: "moderate", label: "Moderate", value: riskModerate },
          { key: "high", label: "High", value: riskHigh },
          { key: "critical", label: "Critical", value: riskCritical },
        ],
        total: riskTotal,
      },
      counselorLoad: { dimension: "counselor", items: counselorLoad },
    },
    appointmentsWeeklyStatus: seriesAppointments,
    funnel,
    retention,
    screeningTools,
    chatActivity,
    topCounselors,
    scoreTrendByRisk,
    aggregateExample: {
      dateRange: {
        from: periodRange.split("/")[0],
        to: periodRange.split("/")[1],
      },
      summaryRef: "#/summary",
      engagementTimeseriesRef: "#/timeseries/engagement_multi",
      riskDistributionRef: "#/distributions/riskLevel",
      appointmentsWeeklyStatusRef: "#/appointmentsWeeklyStatus",
      funnelRef: "#/funnel",
      retentionRef: "#/retention",
      topCounselorsRef: "#/topCounselors",
    },
    _meta: {
      generatedAt: new Date().toISOString(),
      notes:
        "Synthetic dataset (testing mode) – structure matches frontend expectation.",
      version: 2,
    },
  };

  debugLog("✅ Structured dashboard payload generated");
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Admin dashboard stats (structured)"));
});
