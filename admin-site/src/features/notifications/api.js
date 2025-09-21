const DUMMY_NOTIFICATIONS = [
  { _id: 'n1', title: 'Welcome', message: 'Welcome to the admin dashboard!', read: false },
  { _id: 'n2', title: 'Report Ready', message: 'Weekly insights report is ready.', read: true },
]

export const getNotifications = async () => {
  return { notifications: DUMMY_NOTIFICATIONS }
}

export const readAllNotifications = async () => {
  DUMMY_NOTIFICATIONS.forEach((n) => (n.read = true))
  return { success: true }
}

export const readNotification = async (id) => {
  const n = DUMMY_NOTIFICATIONS.find((x) => x._id === id)
  if (n) n.read = true
  return { success: true }
}
