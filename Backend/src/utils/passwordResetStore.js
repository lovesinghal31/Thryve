// Simple in-memory password reset token store.
// Structure: key = email, value = { token, expiry, attempts }
// NOTE: Replace with persistent store (Redis) in production.
const passwordResetStore = new Map();
export { passwordResetStore };
