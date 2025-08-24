import { emailVerificationLink } from "@/email/emailVerification";
import { otpEmail } from "@/email/otpEmail";
import { ConnectDB } from "@/lib/db";
import { catchError, generateOtp, helperResponse } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.models";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(req) {
  try {
    await ConnectDB();

    // Parse request body
    const payload = await req.json();

    // Validate input fields (email + password)
    const validationSchema = zodSchema.pick({ email: true }).extend({
      password: z.string(),
    });

    const validateData = validationSchema.safeParse(payload);

    if (!validateData.success) {
      return helperResponse(
        false,
        401,
        "Invalid or missing input field",
        validateData.error
      );
    }

    const { email, password } = validateData.data;

    // Find user by email
    const user = await UserModel.findOne({ deleteAt: null, email }).select(
      "+password"
    );
    if (!user) {
      return helperResponse(false, 404, "Invalid login credentials");
    }

    // Check password match
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return helperResponse(false, 401, "Invalid credentials");
    }

    // If email is not verified, send verification email
    if (!user.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: user._id.toString() })
        .setIssuedAt()
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);

      await sendMail(
        "Email Verification request from Rahul Sah",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );

      return helperResponse(true, 200, "Verification link sent to your email.");
    }

    //   Email verified and password matched — now continue with OTP login

    await OTPModel.deleteMany({ email });

    // Generate a new 6-digit OTP
    const otp = generateOtp();

    // Save OTP to DB with expiry
    const newOtp = new OTPModel({ email, otp });
    await newOtp.save();

    // Send OTP to user's email
    const otpEmailStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return helperResponse(false, 500, "Failed to send OTP email");
    }

    return helperResponse(
      true,
      200,
      "OTP sent to your email for verification."
    );
  } catch (error) {
    return catchError(error);
  }
}
