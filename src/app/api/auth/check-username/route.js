import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { username } = await req.json();

    if (!username) {
      return Response.json(
        { available: false, message: "Username is required" },
        { status: 400 }
      );
    }

    // Match schema regex
    const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(username);
    if (!isValid) {
      return Response.json(
        { available: false, message: "Invalid username format" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ username });

    return Response.json({
      available: !exists,
      message: exists ? "Username already taken" : "Username is available",
    });
  } catch (error) {
    console.error("CHECK USERNAME ERROR:", error);
    return Response.json(
      { available: false, message: "Server error" },
      { status: 500 }
    );
  }
}
