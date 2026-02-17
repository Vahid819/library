import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bycript from "bcryptjs";

export async function POST(req) {
  await dbConnect();
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required" },
        { status: 400 },
      );
    }

    const verifiedUser = await User.findOne({ email, isVerified: true });

    if (verifiedUser) {
      return NextResponse.json(
        { message: "User already exist and verified" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (user.otpExpires < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const isOtpValid = await bycript.compare(otp, user.otp);

    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    } else {
        user.isVerified = true;
        await user.save();
      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "OTP verification failed" },
      { status: 500 },
    );
  }
}
