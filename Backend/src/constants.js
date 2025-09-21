export const DB_NAME = "sihdb"
const isProd = process.env.NODE_ENV === 'production';
export const cookieOptions = {
  httpOnly: true,                         // not readable by JS
  secure: isProd,                         // must be true on HTTPS (prod)
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};