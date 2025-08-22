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
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoutes";

const Loginpage = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formSchema = zodSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min("3", "password field is required"),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (value) => {
    console.log("Login submitted:", value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <Card className="w-[450px] shadow-lg rounded-md">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <Image
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt="logo"
              className="max-w-[150px]"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FE6800]">
              Login Into Account
            </h1>
            <p className="text-sm text-gray-700">
              Login into your account by filling out the form below.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLoginSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize text-sm text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="quickkart@gmail.com"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      {/* hide and show password  */}
                      <div className="absolute top-[35px]  right-4 ">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer "
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

              <div>
                <ButtonLoading
                  text="Login"
                  className="w-full cursor-pointer"
                  type="submit"
                  loading={loginLoading}
                />
              </div>
              <div className="mt-4 text-center text-sm">
                <p>
                  Don't have an account?{" "}
                  <Link
                    href={WEBSITE_REGISTER}
                    className="font-medium text-primary underline hover:text-primary/80"
                  >
                    Create account!
                  </Link>
                </p>
                <p className="mt-2">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-primary underline hover:text-primary/80"
                  >
                    Forgot password?
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

export default Loginpage;