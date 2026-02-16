import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

function generateUsername(name, email) {
  const base =
    name?.toLowerCase().replace(/\s+/g, "") ||
    email.split("@")[0];

  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request) {
  console.log("🚀 SIGNUP API HIT");

  try {
    await connectDB();
    console.log("✅ DB connected");

    const body = await request.json();
    console.log("📦 Request body:", body);

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email and password are required" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    console.log("👤 Existing user:", existingUser);

    // ✅ CASE 1: OTP USER EXISTS → COMPLETE REGISTRATION
    if (existingUser && !existingUser.isVerified) {
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUser.name = name;
      existingUser.username =
        existingUser.username || generateUsername(name, email);
      existingUser.password = hashedPassword;
      existingUser.isVerified = true;

      // 🧹 CLEAN OTP FIELDS
      existingUser.otp = undefined;
      existingUser.otpAttempt = undefined;
      existingUser.otpExpires = undefined;

      await existingUser.save();

      console.log("🎉 User activated:", existingUser._id);

      return new Response(
        JSON.stringify({
          message: "User registered successfully",
          username: existingUser.username,
        }),
        { status: 201 }
      );
    }

    // ❌ CASE 2: USER ALREADY VERIFIED
    if (existingUser && existingUser.isVerified) {
      return new Response(
        JSON.stringify({ error: "User already exists" }),
        { status: 400 }
      );
    }

    // ❌ CASE 3: SHOULD NEVER HAPPEN
    return new Response(
      JSON.stringify({ error: "Invalid signup state" }),
      { status: 400 }
    );

  } catch (error) {
    console.error("🔥 SIGNUP ERROR:", error);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
