
 
 
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import UserModel from "@/models/user.models";
import { zodSchema } from "@/lib/zodSchema";
import { ConnectDB } from "@/lib/db";
import { helperResponse } from "@/lib/helperFunction";
import OTPModel from "@/models/otp.model";

export async function POST(request) {
  try {
    await ConnectDB();

    const payload = await request.json();

    const validationSchema = zodSchema.pick({
      otp: true,
      email: true,
    });

    const result = validationSchema.safeParse(payload);

    if (!result.success) {
      return helperResponse("Invalid input", 400, false, result.error.errors);
    }

    const { email, otp } = result.data;

    // Find user
    const user = await UserModel.findOne({ email, deleteAt: null });
    if (!user) return helperResponse("User not found", 404, false);

    // ✅ Find OTP record
    const otpRecord = await OTPModel.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return helperResponse("Invalid OTP", 400, false);
    }

    const now = new Date();
    if (otpRecord.otpExpiry && otpRecord.otpExpiry < now) {
      return helperResponse("OTP has expired", 400, false);
    }

    // ✅ Clean up OTP
    await OTPModel.deleteMany({ email });

    // ✅ Mark user verified
    user.isVerified = true;
    await user.save();

    // Create JWT
    const loginPayload = {
      _id: user._id,
      role: user._role,
      name: user.name,
      avatar: user.avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loginPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return helperResponse("Login successful", 200, true, {
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return catchError(error);
  }
}
