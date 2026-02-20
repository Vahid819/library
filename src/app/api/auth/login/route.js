import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password required" },
        { status: 400 },
      );
    }

    // ✅ FIND USER BY EMAIL
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isVerified || !user.isActive) {
      return Response.json(
        { message: "Account not verified or disabled" },
        { status: 403 },
      );
    }

    // 🔐 CREATE JWT
    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      username: user.username, // 🔥 REQUIRED
      role: user.role,
    });

    // 🍪 SET COOKIE (Next 15+ safe)
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    user.lastLoginAt = new Date();
    await user.save();

    // ✅ RETURN USERNAME
    return Response.json({
      message: "Login successful",
      username: user.username, // 🔥 THIS FIXES YOUR ISSUE
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
  