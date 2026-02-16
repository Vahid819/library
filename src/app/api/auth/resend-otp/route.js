import NextResponse from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bycript from "bcryptjs";

export async function POST(req) {
    await dbConnect();

    try {
        const { email } = await req.json();

        if(!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if(!user) {
            return NextResponse.json(
                { message: "User with this email does not exist" },
                { status: 400 }
            );
        }
        if(user.verifieduser) {
            return NextResponse.json(
                { message: "User is already verified" },
                { status: 400 }
            );
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bycript.hash(otp, 10);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        user.otp = hashedOtp;
        user.otpAtempt = 0;
        user.otpExpires = otpExpires;
        await user.save();
        // Send OTP email logic here (you can reuse the logic from send-otp route)

        return NextResponse.json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (error) {
        console.error("Error in resend OTP route:", error);
        return NextResponse.json(
            { message: "Failed to resend OTP" },
            { status: 500 }
        );
    }
}