import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { otpStore } from "../utils/otpStore.js";
import sendEmail from "../utils/sendEmail.js";
import { Institute } from "../models/institue.model.js";
import { cookieOptions } from "../constants.js";

// Institution logger helpers
const log = (...args) => console.log("🏫 [Institution]", ...args);
const warn = (...args) => console.warn("⚠️ [Institution]", ...args);
const error = (...args) => console.error("❌ [Institution]", ...args);

// to add the institution
// fields required : name, address, contactEmail, contactPhone, website
// first to check if any of these fields are missing or not
// then check if the name or contactEmail already exists
// if not then create a new institution
// finally send a response to the user that institution has been added
const addInstitution = asyncHandler(async (req, res) => {
    const { name, address, contactEmail, contactPhone, website } = req.body;
    // Check for missing fields
    log("🔍 Validating required fields for institution creation");
    if ([name, contactEmail, address, contactPhone, website].some((field) => field.trim() === "")) {
    warn("Missing required field detected", { name, contactEmail, address, contactPhone, website });
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
    }

    // Check if institution already exists with just contactEmail only
    log("🔎 Checking for existing institution with email", contactEmail);
    const existingInstitution = await Institute.findOne({ contactEmail });
    if (existingInstitution) {
    warn("Institution already exists", { contactEmail });
        return res.status(400).json(new ApiResponse(400, {}, "Institution with this email already exists"));
    }

    // Create new institution
    log("🏗️ Creating institution document");
    const newInstitution = await Institute.create({
        name,
        address,
        contactEmail,
        contactPhone,
        website
    });

    // Send response
    log("✅ Institution created", { id: newInstitution._id.toString(), name: newInstitution.name });
    return res.status(201).json(new ApiResponse(201, {institueName: newInstitution.name, contactEmail: newInstitution.contactEmail}, "Institution added successfully"));
});

export { addInstitution };