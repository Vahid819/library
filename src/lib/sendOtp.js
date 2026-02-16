import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import OtpEmail from "@/emails/otp-email";

export async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = render(<OtpEmail otp={otp} />);

  await transporter.sendMail({
    from: `"Library System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html,
  });
}
