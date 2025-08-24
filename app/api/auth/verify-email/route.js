import UserModel from "@/models/user.models";
import { jwtVerify } from "jose";
import { catchError, helperResponse } from "@/lib/helperFunction";
import { ConnectDB } from "@/lib/db.js";

export async function POST(request) {
  try {
    await ConnectDB();

    const { token } = await request.json();

    console.log("Token from request:", token);

    if (!token) {
      return helperResponse(false, 400, "Missing token.");  
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    
    // Add error handling for JWT verification
    let decoded;
    try {
      decoded = await jwtVerify(token, secret);
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError.message);
      return helperResponse(false, 401, "Invalid or expired token.");
    }

    const userId = decoded.payload.userId;

    // get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return helperResponse(false, 404, "User not found.");
    }

    // update user
    user.isEmailVerified = true;
    await user.save();

    return helperResponse(true, 200, "Email verification success."); // Fixed: use helperResponse instead of response
  } catch (error) {
    console.error("Verification error:", error);
    return catchError(error);
  }
}