"use server"

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function getAuthUser() {
  const cookieStore = await cookies();

  // ✅ Safe way (Next 14–16 compatible)
  const token = cookieStore
    .getAll()
    .find((c) => c.name === "auth_token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}
