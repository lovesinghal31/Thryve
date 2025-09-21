import mongoose, { Schema } from "mongoose";

// Appointment schema: scheduling sessions between student & counselor.
// Enhancements: standardized institutionId, notes, reason, indexing.
const appointmentSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    screeningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screening",
    },
    isEmergency: {
      type: Boolean,
      default: false,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed", "no-show"],
      default: "booked",
      index: true,
    },
    reason: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Backwards compatibility virtual (if legacy code still uses 'institute')
appointmentSchema.virtual('institute').get(function() { return this.institutionId; });

appointmentSchema.index({ counselorId: 1, startTime: 1 });
appointmentSchema.index({ studentId: 1, startTime: -1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
