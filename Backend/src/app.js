import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// routes import
import userRoutes from "./routes/user.routes.js";
import instituteRoutes from "./routes/institue.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminAnalyticsRoutes from "./routes/adminAnalytics.routes.js";
import screeningRoutes from "./routes/screening.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import notificationRoutes from "./routes/notification.routes.js";


// routes declaration
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/institutes", instituteRoutes);
app.use("/api/v1/admin-dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/analytics", adminAnalyticsRoutes);
app.use("/api/v1/screenings", screeningRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/notifications", notificationRoutes);


export { app };