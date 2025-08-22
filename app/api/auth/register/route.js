import { zodSchema } from "@/lib/zodSchema";
import { ConnectDB } from "@/lib/db.js";
import User from "@/models/user.models.js";
import { helperResponse } from "@/lib/helperFunction";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerification";
import UserModel from "@/models/user.models.js";

export async function POST(req) {
  try {
    // Connect to database
    await ConnectDB();

    // Define validation schema (pick only required fields)
    const validationSchema = zodSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    // Parse request body
    const payload = await req.json();

    // Validate data using Zod
    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success) {
      return helperResponse(
        false,
        409,
        "Invalid credentials",
        validateData.error
      );
    }

    const { name, email, password } = validateData.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return helperResponse(true, 409, "Email already registered");
    }

    // Create new user (with hashed password)
    const newUser = new UserModel({ name, email, password });
    await newUser.save();

    // Create JWT token - FIXED: Remove await from TextEncoder and fix variable name
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id })
      .setIssuedAt()
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    // Send verification email
    await sendMail(
      "Email Verification request from Rahul Sah",
      email,
      emailVerificationLink(`
        ${process.env.NEXT_PUBLIC_BASE_URL}/verifyEmail/${token}`
        
      )
    );

    // User registered successfully
    return helperResponse(
      true,
      200,
      "User registered successfully, Please verify your email address"
    );
  } catch (error) {
    console.error("Register Error:", error);
    return helperResponse(false, 500, "Internal Server Error", error.message);
  }
}