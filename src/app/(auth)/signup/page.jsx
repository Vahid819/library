"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations/signup-schema";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { maskEmail } from "@/helper/maskEmail";

export default function Page() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  // null | "available" | "taken" | "invalid"


  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const emailValue = form.watch("email");
  const passwordValue = form.watch("password");

  // 🔄 Clear error on change
  useEffect(() => {
    if (error) setError("");
  }, [emailValue, otp, passwordValue]);

  // ⏱ OTP resend timer
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  // ================= SEND OTP =================
  async function sendOtp() {
    try {
      setSendingOtp(true);
      setError("");

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOtpSent(true);
      setResendTimer(30);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  }

  // ================= CREATE ACCOUNT =================
  async function createAccount(values) {
    if (!otpSent || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Verify OTP
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message);

      // Signup
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          username: values.username || undefined, // 🔑 optional
          email: values.email,
          password: values.password,
        }),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok)
        throw new Error(signupData.error || signupData.message);

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // Check username avaiblility

  const usernameValue = form.watch("username");

  useEffect(() => {
    if (!usernameValue || otpSent) {
      setUsernameStatus(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setCheckingUsername(true);

        const res = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: usernameValue }),
        });

        const data = await res.json();

        if (!res.ok) {
          setUsernameStatus("invalid");
          return;
        }

        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("invalid");
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [usernameValue, otpSent]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Sign up to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>
                🎉 Account created! Redirecting…
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={form.handleSubmit(createAccount)}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <Label>Full Name</Label>
              <Input {...form.register("name")} />
            </div>

            {/* Username */}
            <div>
              <Label>Username (optional)</Label>

              <div className="relative">
                <Input
                  {...form.register("username")}
                  disabled={otpSent}
                  className={
                    usernameStatus === "available"
                      ? "border-green-500"
                      : usernameStatus === "taken"
                        ? "border-red-500"
                        : ""
                  }
                />

                <div className="absolute right-3 top-2.5 text-sm">
                  {checkingUsername && "⏳"}
                  {usernameStatus === "available" && "✅"}
                  {usernameStatus === "taken" && "❌"}
                </div>
              </div>

              <p className="text-xs mt-1">
                {usernameStatus === "available" && (
                  <span className="text-green-600">Username is available</span>
                )}
                {usernameStatus === "taken" && (
                  <span className="text-red-600">Username already taken</span>
                )}
                {!usernameStatus && (
                  <span className="text-muted-foreground">
                    Lowercase letters, numbers, hyphens only
                  </span>
                )}
              </p>
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <div className="flex gap-2">
                <Input {...form.register("email")} disabled={otpSent} />
                {emailValue && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={sendOtp}
                    disabled={sendingOtp || otpSent}
                  >
                    {otpSent
                      ? "OTP Sent"
                      : sendingOtp
                        ? "Sending..."
                        : "Send OTP"}
                  </Button>
                )}
              </div>
            </div>

            {/* OTP */}
            {otpSent && (
              <div>
                <Label>
                  Enter OTP sent to{" "}
                  <span className="font-medium text-primary">
                    {maskEmail(emailValue)}
                  </span>
                </Label>

                <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <div className="text-center text-sm mt-1 text-muted-foreground">
                  {resendTimer > 0 ? (
                    <>
                      Resend OTP in <b>{resendTimer}s</b>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm */}
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" {...form.register("confirmPassword")} />
            </div>

            <Button
              className="w-full"
              disabled={
                loading || !otpSent || otp.length !== 6 || !passwordValue
              }
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <Separator />

          <div className="space-y-3">
            <Button variant="outline" className="w-full flex gap-2">
              <FcGoogle size={20} /> Continue with Google
            </Button>
            <Button variant="outline" className="w-full flex gap-2">
              <FaGithub size={20} /> Continue with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
