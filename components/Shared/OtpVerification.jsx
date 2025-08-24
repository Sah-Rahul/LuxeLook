"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { zodSchema } from "@/lib/zodSchema";
import axios from "axios";
import { showToast } from "@/lib/showToast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

import ButtonLoading from "./ButtonLoading";

const OtpVerification = ({ email, onsubmit, loading }) => {
  const [resendingOtp, setResendingOtp] = useState(false);

  const forSchema = zodSchema.pick({ otp: true, email: true });

  const form = useForm({
    resolver: zodResolver(forSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  //  VERIFY OTP
  const handleOtpVerification = (values) => {
    onsubmit(values);
  };

  //  RESEND OTP
  const resendOtp = async () => {
    try {
      setResendingOtp(true);
      const { data } = await axios.post("/api/auth/resend-otp", {
        email,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to resend OTP.");
      }

      showToast("success", data.message);
    } catch (error) {
      console.error("❌ RESEND OTP ERROR:", error);
      showToast("error", error.message);
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div>
      {/* Informational Message */}
      <div className="mb-4 text-center text-sm text-gray-700">
        We have sent an OTP to{" "}
        <span className="font-medium text-[#FE6800]">{email}</span>. <br />
        Please check your inbox and verify your account.
      </div>

      <div className="text-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOtpVerification)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-center">
                    <FormLabel className="capitalize text-sm text-gray-700">
                      OTP
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="flex items-center justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*   Verify Button */}
            <ButtonLoading
              text="Verify OTP"
              className="w-full cursor-pointer"
              type="submit"
              loading={loading}
            />
          </form>
        </Form>

        {/* Resend OTP Button */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Didn’t receive the code?{" "}
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendingOtp}
            className={`ml-1 font-medium cursor-pointer ${
              resendingOtp
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#FE6800] hover:underline"
            }`}
          >
            {resendingOtp ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
