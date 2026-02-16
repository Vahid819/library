"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyOtp() {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    alert("OTP verified successfully 🎉");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <Button className="w-full" onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
