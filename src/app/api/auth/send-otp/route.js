import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import OtpEmail from "@/mails/otpverification";
import { render } from "@react-email/render";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    console.log("📩 Send OTP API called");

    await dbConnect();
    console.log("✅ Database connected");

    const { email } = await req.json();
    console.log("📧 Email received:", email);

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    console.log("👤 Existing user:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔐 OTP generated:", otp);

    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log("🔒 OTP hashed");

    // ⚠️ THIS WILL STILL FAIL IF name/password ARE REQUIRED
    const newUser = new User({
      email,
      otp: hashedOtp,
      otpAttempt: 0,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newUser.save();
    console.log("💾 User saved with OTP");

    // ✅ FIXED LINE
    const emailHtml = await render(<OtpEmail otp={otp} />);
    console.log("📨 Email HTML rendered");

    const mailResponse = await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: emailHtml,
    });

    console.log("✅ Email sent:", mailResponse.messageId);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("🔥 SEND OTP ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to send OTP",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
