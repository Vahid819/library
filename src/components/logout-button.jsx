"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // ✅ important
    });

    // ✅ FULL reload so middleware sees updated cookies
    window.location.href = "/login";
  }

  return (
    <Button variant="destructive" onClick={logout}>
      Logout
    </Button>
  );
}