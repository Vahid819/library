import mongoose from "mongoose";
import { regex } from "zod";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        trim: true,
        lowercase: [true, "Username must be in lowercase"],
        regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: [true, "Email must be in lowercase"],
        regex: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    otp: {
        type: Number,
        required: [true, "OTP is required"],
    },
    otpAtempt: {
        type: Number,
        required: [true, "OTP attempt count is required"],
    },
    otpExpires: {
        type: Date,
        required: [true, "OTP expiration time is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: 6
    },
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema) || mongoose.models.User

export default User