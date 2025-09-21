import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { otpStore } from "../utils/otpStore.js";
import sendEmail from "../utils/sendEmail.js";
import { Institute } from "../models/institue.model.js";
import { cookieOptions } from "../constants.js";

// to add the institution
// fields required : name, address, contactEmail, contactPhone, website
// first to check if any of these fields are missing or not
// then check if the name or contactEmail already exists
// if not then create a new institution
// finally send a response to the user that institution has been added
const addInstitution = asyncHandler(async (req, res) => {
    const { name, address, contactEmail, contactPhone, website } = req.body;
    // Check for missing fields
    console.log("🔍 Checking for missing fields...");
    if ([name, contactEmail, address, contactPhone, website].some((field) => field.trim() === "")) {
        console.log("❌ Missing fields detected!");
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
    }

    // Check if institution already exists with just contactEmail only
    console.log("🔎 Checking if institution already exists...");
    const existingInstitution = await Institute.findOne({ contactEmail });
    if (existingInstitution) {
        console.log("⚠️ Institution already exists!");
        return res.status(400).json(new ApiResponse(400, {}, "Institution with this email already exists"));
    }

    // Create new institution
    console.log("🏫 Creating new institution...");
    const newInstitution = await Institute.create({
        name,
        address,
        contactEmail,
        contactPhone,
        website
    });

    // Send response
    console.log("✅ Institution added successfully!");
    return res.status(201).json(new ApiResponse(201, {institueName: newInstitution.name, contactEmail: newInstitution.contactEmail}, "Institution added successfully"));
});

export { addInstitution };