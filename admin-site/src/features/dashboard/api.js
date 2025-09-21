// Dummy dashboard metrics (no network)
export const getAdminDashboard = async () => {
  return {
    instituteName: 'IET-DAVV',
    totalUsers: 1234,
    newUsers: 42,
    returningUsers: 310,
    activeUsersDaily: 220,
    activeUsersWeekly: 780,
    activeUsersMonthly: 1130,
    screeningsByTool: { PHQ9: 120, GAD7: 95, GHQ: 60, SDQ: 40 },
    riskLevelDistribution: { low: 60, medium: 25, high: 10, critical: 5 },
    appointmentsByStatus: { booked: 18, completed: 32, canceled: 6 },
    averageSessionDuration: 38,
    averageWaitTimeForAppointment: 12,
    percentageUsersShowingImprovement: 67,
    totalScreenings: 315,
    highRiskFlags: 14,
    screeningCompletionRate: 82,
    totalAppointments: 56,
    appointmentConversionRate: 44.8,
    emergencyEscalations: 3,
    totalResources: 128,
    totalChatRooms: 9,
    averageMessagesPerUser: 12.4,
    weeklyRetentionRate: 76,
  }
}
