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
  // console.log("🚀 SIGNUP API HIT");

  try {
    await connectDB();
    // console.log("✅ DB connected");

    const { name, email, password, username } = await request.json();
    // console.log("📦 Request body:", { name, email });

    if (!name || !email || !password) {
      return Response.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    // console.log("👤 Existing user:", user);

    // ❌ No OTP flow happened
    if (!user) {
      return Response.json(
        { message: "Please verify your email first" },
        { status: 400 }
      );
    }

    // ❌ OTP not verified
    if (!user.isVerified) {
      return Response.json(
        { message: "Please verify OTP before signup" },
        { status: 400 }
      );
    }

    // ❌ User already fully registered
    if (user.password) {
      return Response.json(
        { message: "User already registered. Please login." },
        { status: 400 }
      );
    }

    // ✅ COMPLETE REGISTRATION
    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.username = username || generateUsername(name, email);
    user.password = hashedPassword;
    user.provider = "credentials";

    // 🧹 Clean OTP fields
    user.otp = undefined;
    user.otpAttempt = undefined;
    user.otpExpires = undefined;

    await user.save();

    // console.log("🎉 User registration completed:", user._id);

    return Response.json(
      {
        message: "User registered successfully",
        username: user.username,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("🔥 SIGNUP ERROR:", error);

    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
