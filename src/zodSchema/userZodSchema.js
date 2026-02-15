import zod from "zod";

export const userZodSchema = zod.object({
  name: zod.string().min(1, "Name is required").trim(),
  username: zod
    .string()
    .min(1, "Username is required")
    .trim()
    .lowercase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Username must be in lowercase and can only contain letters, numbers, and hyphens",
    )
    .required("Username is required"),
  email: zod
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .trim()
    .lowercase()
    .regex(
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email format",
    )
    .required("Email is required"),
  password: zod
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .trim(),
  otp: zod
    .string()
    .required("OTP is required")
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});
