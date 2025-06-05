import { NextResponse } from "next/server";
import User from "../../../database/models/userModel/userSchema";
import db from "../../../database/lib/db";
import { verifyToken } from "../../../utils/jwt";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await db();

    const cookie = await cookies();
    const token = cookie.get("token")?.value;
    const userId = verifyToken(token);

    const user = await User.findById(userId.id).select("-password -__v");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
