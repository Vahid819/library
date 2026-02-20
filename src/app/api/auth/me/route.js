import { getAuthUser } from "@/helper/getAuthUser";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(authUser.id).lean();

  return Response.json({
    username: user.username,
    email: user.email,
  });
}
