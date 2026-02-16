import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Username format is invalid",
      ],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email format is invalid",
      ],
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    // 🔐 OTP (temporary)
    otp: String,
    otpAttempt: { type: Number, default: 0 },
    otpExpires: Date,

    // ✅ Verification & status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // 🧑 Role & access
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🖼 Profile
    avatar: String,
    bio: { type: String, maxlength: 200 },

    // 🔑 Auth provider
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },

    // 🔒 Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // 📊 Tracking
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
