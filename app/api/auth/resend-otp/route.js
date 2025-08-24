 
import { ConnectDB } from "@/lib/db";
 
 
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";
import OTPModel from "@/models/otp.model";
import { zodSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.models";
import { catchError, generateOtp, helperResponse } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await ConnectDB();

    //   Get payload
    const payload = await request.json();

    //   Validate email from payload
    const validationSchema = zodSchema.pick({
      email: true,
    });
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return helperResponse(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error
      );
    }

    const { email } = validatedData.data;

    //   Check if user exists
    const getUser = await UserModel.findOne({ email });

    if (!getUser) {
      return helperResponse(false, 404, "User not found.");
    }

    //   Remove previous OTPs
    await OTPModel.deleteMany({ email });

    //   Generate new OTP
    const otp = generateOtp();

    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    //   Send OTP via email
    const otpSendStatus = await sendMail(
      "Your login verification code.",
      email,
      otpEmail(otp)
    );

    if (!otpSendStatus.success) {
      return helperResponse(false, 400, "Failed to resend OTP.");
    }

    return helperResponse(true, 200, "OTP sent successfully.");
  } catch (error) {
    console.log('resend--------------------',error)
    return catchError(error);
  }
}
