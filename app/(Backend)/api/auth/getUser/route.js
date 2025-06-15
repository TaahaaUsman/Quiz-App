// app/api/auth/getUser/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import db from "@/app/(Backend)/database/lib/db";
import User from "@/app/(Backend)/database/models/userModel/userSchema";
import { verifyToken } from "@/app/(Backend)/utils/jwt";
import { authOptions } from "@/app/(Backend)/database/lib/authOptions";

export async function GET() {
  try {
    await db(); // Ensure DB is connected

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // ✅ Case 1: Handle Custom JWT Token
    if (token) {
      try {
        const decoded = verifyToken(token); // You return { id } from your jwt
        const user = await User.findById(decoded.id).select("-password -__v");

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(user, { status: 200 });
      } catch (err) {
        console.error("JWT error:", err);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // ✅ Case 2: Handle NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select(
        "-password -__v"
      );
      if (user) return NextResponse.json(user, { status: 200 });
    }

    // ❌ If neither token nor session found
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (err) {
    console.error("getUser error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
