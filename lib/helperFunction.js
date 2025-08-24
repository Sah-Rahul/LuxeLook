import { NextResponse } from "next/server";

export function helperResponse(success, status, message, data = null) {
  return NextResponse.json(
    {
      success,
      message,
      data
    },
    { status }
  );
}

export function catchError(error) {
  console.error("Catch Error:", error);
  
  return NextResponse.json(
    {
      success: false,
      message: error.message || "Internal Server Error",
    },
    { status: 500 }
  );
}

export const generateOtp = () =>{
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  return otp
}