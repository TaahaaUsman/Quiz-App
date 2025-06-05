import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await db();
    const { password, confirmPassword } = await request.json();

    // ✅ 1. Input validation (basic)
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // 🍪 Get token from cookies
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    // 🔍 Decode token to get userId or email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔐 Hash new password and save
    const hashedPassword = await bcrypt.hash(password, 11);
    user.passwordHash = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("❌ Error in reset-password:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
