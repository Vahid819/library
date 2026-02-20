import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/helper/getAuthUser";
import { LogoutButton } from "@/components/logout-button";

export default async function Page(props) {
  const { username } = await props.params;

  // 1️⃣ AUTH CHECK
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/login");
  }

  // ❌ Invalid username in URL
  if (!username || username === "undefined") {
    redirect("/login");
  }

  await connectDB();

  // 2️⃣ FETCH USER
  const user = await User.findOne({ username }).lean();
  if (!user) {
    notFound();
  }

  // 3️⃣ ROLE-BASED REDIRECT
  if (authUser.role === "admin") {
    redirect("/admin");
  }

  // 4️⃣ AUTHORIZATION CHECK (user can only see own page)
  if (authUser.id !== user._id.toString()) {
    redirect("/unauthorized");
  }

  // ✅ AUTHORIZED USER VIEW
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user.name}
      </h1>

      <p className="text-muted-foreground mt-1">
        @{user.username}
      </p>

      <div className="mt-4 space-y-2">
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Status:</b> {user.isActive ? "Active" : "Inactive"}</p>
        <LogoutButton />
      </div>
    </div>
  );
}
