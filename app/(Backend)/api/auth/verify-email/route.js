import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createToken } from "../../../utils/jwt";

export async function POST(request) {
  try {
    await db();

    const cookieStore = await cookies();
    const appType = request.headers.get("x-app-type") || "";
    const isReactNative = appType === "ReactNative";

    const body = await request.json();
    const code = body.code;
    const email = isReactNative
      ? body.email
      : cookieStore.get("verifyEmail")?.value;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in request or session" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 200 }
      );
    }

    if (
      user.emailVerificationCode !== code ||
      user.emailVerificationExpiry < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Create JWT token
    const token = createToken(user._id);

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
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      cookieStore.delete("verifyEmail");
    }

    return response;
  } catch (err) {
    console.error("❌ Email verification error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
