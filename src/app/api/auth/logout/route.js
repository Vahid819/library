import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("auth_token", {
    path: "/", // 👈 IMPORTANT
  });

  return Response.json({ success: true });
}