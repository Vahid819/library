import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ✅ MAIL SERVER
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // ✅ email address
    pass: process.env.EMAIL_PASS, // ✅ app password
  },
});
