import db from "@/app/(Backend)/database/lib/db";
import User from "@/app/(Backend)/database/models/userModel/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createToken } from "@/app/(Backend)/utils/jwt";

export async function POST(request) {
  await db();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (!user.isEmailVerified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 403 });
  }

  const token = createToken(user._id);

  // Check if the client is React Native by custom header (recommended)
  const userAgent = request.headers.get("user-agent") || "";
  const isReactNative =
    userAgent.includes("Expo") || userAgent.includes("ReactNative");

  const responseBody = {
    message: "Login successful",
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  };

  const response = NextResponse.json(responseBody, { status: 200 });

  if (!isReactNative) {
    // Set cookie only for browser clients
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  return response;
}

// CORS for React Native support
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // or your expo dev server
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
