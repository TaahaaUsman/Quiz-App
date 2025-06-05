import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createToken } from "../../../utils/jwt";

export async function POST(request) {
  try {
    await db();
    const { email, password } = await request.json();

    // ✅ 1. Input validation (basic)
    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Optional: Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 }
      );
    }

    const token = createToken(user._id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Sending success response
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (err) {
    console.log("❌ Error in Login API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
