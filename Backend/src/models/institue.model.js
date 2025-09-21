import mongoose, { Schema } from "mongoose";

const InstituteSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String },
    contactEmail: { type: String, required: true, unique: true },
    contactPhone: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

export const Institute = mongoose.model("Institute", InstituteSchema);
