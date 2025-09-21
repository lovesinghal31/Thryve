// Dummy dataset provided by user (Appointments)
const DUMMY_APPOINTMENTS = [
  { "studentId": "6700000000000000000000b1", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000001", "startTime": "2025-09-23T10:00:00.000Z", "endTime": "2025-09-23T10:30:00.000Z", "reason": "Follow-up on last screening", "notes": "Prefers morning slots", "isEmergency": false },
  { "studentId": "6700000000000000000000b2", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000002", "startTime": "2025-09-24T09:30:00.000Z", "endTime": "2025-09-24T10:00:00.000Z", "reason": "Routine check-in", "notes": "Student requested short session", "isEmergency": false },
  { "studentId": "6700000000000000000000b3", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000001", "startTime": "2025-09-25T11:00:00.000Z", "endTime": "2025-09-25T11:30:00.000Z", "reason": "Discuss coping strategies", "isEmergency": false },
  { "studentId": "6700000000000000000000b4", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000002", "startTime": "2025-09-26T08:30:00.000Z", "endTime": "2025-09-26T09:00:00.000Z", "reason": "Progress update", "notes": "Bring journal", "isEmergency": false },
  { "studentId": "6700000000000000000000b5", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000001", "startTime": "2025-09-27T13:15:00.000Z", "endTime": "2025-09-27T13:45:00.000Z", "reason": "Brief check-in", "isEmergency": false },
  { "studentId": "6700000000000000000000b6", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000002", "startTime": "2025-09-29T10:00:00.000Z", "endTime": "2025-09-29T10:30:00.000Z", "reason": "Follow-up assignment review", "isEmergency": false },
  { "studentId": "6700000000000000000000b7", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000001", "screeningId": "6800000000000000000000c1", "startTime": "2025-09-24T13:00:00.000Z", "endTime": "2025-09-24T13:45:00.000Z", "reason": "High GAD-7 score flagged", "isEmergency": false, "status": "booked" },
  { "studentId": "6700000000000000000000b8", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000002", "screeningId": "6800000000000000000000c2", "startTime": "2025-09-25T15:00:00.000Z", "endTime": "2025-09-25T15:30:00.000Z", "reason": "PHQ-9 follow-up", "isEmergency": false, "status": "booked" },
  { "studentId": "6700000000000000000000b9", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000001", "screeningId": "6800000000000000000000c3", "startTime": "2025-09-28T12:00:00.000Z", "endTime": "2025-09-28T12:30:00.000Z", "reason": "GHQ abnormal values", "isEmergency": false, "status": "booked" },
  { "studentId": "6700000000000000000000ba", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000002", "screeningId": "6800000000000000000000c4", "startTime": "2025-09-30T10:30:00.000Z", "endTime": "2025-09-30T11:00:00.000Z", "reason": "Review screening outcomes", "isEmergency": false, "status": "booked" },
  { "studentId": "6700000000000000000000bb", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000001", "screeningId": "6800000000000000000000c5", "startTime": "2025-10-01T09:00:00.000Z", "endTime": "2025-10-01T09:30:00.000Z", "reason": "Discuss risk level", "isEmergency": false, "status": "booked" },
  { "studentId": "6700000000000000000000bc", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000002", "screeningId": "6800000000000000000000c6", "startTime": "2025-10-02T14:00:00.000Z", "endTime": "2025-10-02T14:30:00.000Z", "reason": "Next steps after screening", "isEmergency": false, "status": "booked" },
  { "studentId": "6700000000000000000000b1", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000001", "startTime": "2025-09-20T09:15:00.000Z", "endTime": "2025-09-20T09:45:00.000Z", "reason": "Panic symptoms reported", "isEmergency": true, "notes": "Requested immediate callback" },
  { "studentId": "6700000000000000000000b2", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000002", "startTime": "2025-09-20T10:30:00.000Z", "endTime": "2025-09-20T11:00:00.000Z", "reason": "Acute stress", "isEmergency": true },
  { "studentId": "6700000000000000000000b3", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000001", "startTime": "2025-09-21T08:45:00.000Z", "endTime": "2025-09-21T09:15:00.000Z", "reason": "Severe anxiety", "isEmergency": true },
  { "studentId": "6700000000000000000000b4", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000002", "startTime": "2025-09-22T16:00:00.000Z", "endTime": "2025-09-22T16:30:00.000Z", "reason": "Crisis intervention", "isEmergency": true },
  { "studentId": "6700000000000000000000b5", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000001", "startTime": "2025-09-23T12:15:00.000Z", "endTime": "2025-09-23T12:45:00.000Z", "reason": "Urgent evaluation", "isEmergency": true },
  { "studentId": "6700000000000000000000b6", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000002", "startTime": "2025-09-24T07:30:00.000Z", "endTime": "2025-09-24T08:00:00.000Z", "reason": "Emergency same-day", "isEmergency": true },
  { "studentId": "6700000000000000000000b7", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000001", "startTime": "2025-09-26T14:00:00.000Z", "endTime": "2025-09-26T15:00:00.000Z", "reason": "Initial assessment", "isEmergency": false },
  { "studentId": "6700000000000000000000b8", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000002", "startTime": "2025-09-27T10:00:00.000Z", "endTime": "2025-09-27T11:00:00.000Z", "reason": "Extended counseling session", "isEmergency": false },
  { "studentId": "6700000000000000000000b9", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000001", "startTime": "2025-09-28T15:30:00.000Z", "endTime": "2025-09-28T16:30:00.000Z", "reason": "Deep dive into triggers", "isEmergency": false },
  { "studentId": "6700000000000000000000ba", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000002", "startTime": "2025-09-29T09:00:00.000Z", "endTime": "2025-09-29T10:00:00.000Z", "reason": "Psychoeducation session", "isEmergency": false },
  { "studentId": "6700000000000000000000bb", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000001", "startTime": "2025-10-01T11:00:00.000Z", "endTime": "2025-10-01T12:00:00.000Z", "reason": "Skills training", "isEmergency": false },
  { "studentId": "6700000000000000000000bc", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000002", "startTime": "2025-10-02T13:00:00.000Z", "endTime": "2025-10-02T14:00:00.000Z", "reason": "Coping strategies workshop", "isEmergency": false },
  { "studentId": "6700000000000000000000b1", "counselorId": "6600000000000000000000a2", "institutionId": "650000000000000000000001", "startTime": "2025-09-27T11:30:00.000Z", "endTime": "2025-09-27T12:00:00.000Z" },
  { "studentId": "6700000000000000000000b2", "counselorId": "6600000000000000000000a1", "institutionId": "650000000000000000000002", "startTime": "2025-09-28T08:00:00.000Z", "endTime": "2025-09-28T08:30:00.000Z" },
  { "studentId": "6700000000000000000000b3", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000001", "startTime": "2025-09-29T12:30:00.000Z", "endTime": "2025-09-29T13:00:00.000Z" },
  { "studentId": "6700000000000000000000b4", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000002", "startTime": "2025-09-30T14:30:00.000Z", "endTime": "2025-09-30T15:00:00.000Z" },
  { "studentId": "6700000000000000000000b5", "counselorId": "6600000000000000000000a3", "institutionId": "650000000000000000000001", "startTime": "2025-10-01T10:30:00.000Z", "endTime": "2025-10-01T11:00:00.000Z" },
  { "studentId": "6700000000000000000000b6", "counselorId": "6600000000000000000000a4", "institutionId": "650000000000000000000002", "startTime": "2025-10-02T09:00:00.000Z", "endTime": "2025-10-02T09:30:00.000Z" }
]

// Local mappings for names (demo)
const STUDENT_NAMES = {
  '6700000000000000000000b1': 'Aarav Sharma',
  '6700000000000000000000b2': 'Diya Patel',
  '6700000000000000000000b3': 'Ishaan Verma',
  '6700000000000000000000b4': 'Anaya Gupta',
  '6700000000000000000000b5': 'Vivaan Iyer',
  '6700000000000000000000b6': 'Aadhya Reddy',
  '6700000000000000000000b7': 'Kabir Nair',
  '6700000000000000000000b8': 'Meera Singh',
  '6700000000000000000000b9': 'Rohan Das',
  '6700000000000000000000ba': 'Saanvi Rao',
  '6700000000000000000000bb': 'Advait Mehta',
  '6700000000000000000000bc': 'Navya Kulkarni',
}
const COUNSELOR_NAMES = {
  '6600000000000000000000a1': 'Dr. Neha Kapoor',
  '6600000000000000000000a2': 'Dr. Arjun Malhotra',
  '6600000000000000000000a3': 'Dr. Ria Sinha',
  '6600000000000000000000a4': 'Dr. Karan Bhatia',
}
const INSTITUTION_NAMES = {
  '650000000000000000000001': 'IET-DAVV',
  '650000000000000000000002': 'IET-DAVV',
}

// Normalize any backend shape into { items: Appointment[], total, page, pages }
const normalizeAppointments = (payload) => {
  if (!payload) return { items: [], total: 0, page: 1, pages: 1 }
  // Accept common shapes: array; {items}; {data:{items}}; {appointments}; {data:{appointments}}
  const arr = Array.isArray(payload)
    ? payload
    : payload.items
    || payload.appointments
    || payload.data?.items
    || payload.data?.appointments
    || []
  const total = payload.total || payload.data?.total || arr.length
  const page = payload.page || payload.data?.page || 1
  const pages = payload.pages || payload.data?.pages || 1
  // Decorate with names
  const items = arr.map((a) => ({
    ...a,
    studentName: STUDENT_NAMES[a.studentId] || a.studentId,
    counselorName: COUNSELOR_NAMES[a.counselorId] || a.counselorId,
    institutionName: INSTITUTION_NAMES[a.institutionId] || a.institutionId,
  }))
  return { items, total, page, pages }
}

export async function getAppointments(_params = {}) {
  return normalizeAppointments({ items: DUMMY_APPOINTMENTS, total: DUMMY_APPOINTMENTS.length, page: 1, pages: 1 })
}

// Small helper to derive a stable id for list rendering if backend doesn't provide one
export function deriveAppointmentId(a, idx) {
  return (
    a._id ||
    `${a.studentId}-${a.counselorId}-${a.startTime}-${a.endTime || ''}-${idx}`
  )
}
