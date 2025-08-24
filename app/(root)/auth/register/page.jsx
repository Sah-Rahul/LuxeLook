"use client";

import { Card, CardContent } from "@/components/ui/card";
import { zodSchema } from "@/lib/zodSchema";
import logo from "@/public/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import ButtonLoading from "@/components/Shared/ButtonLoading";
import z from "zod";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/routes/WebsiteRoutes";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const Registerpage = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = zodSchema
    .pick({
      name: true,
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and confirm password must be same.",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (values) => {
    try {
      setLoginLoading(true);
      const { data } = await axios.post("/api/auth/register", values);

      if (!data.success) {
        throw new Error(data.message);
      }
      form.reset();
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
      console.error("Register Error:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden ">
      <Card className="w-[430px] h-[685px] shadow-lg rounded-md">
        <CardContent className="p-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt="logo"
              className="max-w-[150px]"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FE6800]">
              Create Account
            </h1>
            <p className="text-sm text-gray-700">
              Register your account by filling out the form below.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegisterSubmit)}
              className="space-y-5"
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize text-sm text-gray-700">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="RahulSah"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          className="bg-white pr-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          className="bg-white pr-10"
                        />
                      </FormControl>
                      <div className="absolute top-[35px] right-4">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeIcon className="text-2xl text-[#FE6800]" />
                          ) : (
                            <EyeOff className="text-[20px] text-[#FE6800]" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div>
                <ButtonLoading
                  text="Register"
                  className="w-full cursor-pointer"
                  type="submit"
                  loading={loginLoading}
                />
              </div>

              {/* Links */}
              <div className="mt-4 text-center text-sm">
                <p>
                  Already have an account?{" "}
                  <Link
                    href={WEBSITE_LOGIN}
                    className="font-medium text-primary underline hover:text-primary/80"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registerpage;
