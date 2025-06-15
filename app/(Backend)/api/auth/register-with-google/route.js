import db from "@/app/(Backend)/database/lib/db";
import User from "@/app/(Backend)/database/models/userModel/userSchema";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/app/(Backend)/utils/jwt";

export async function POST(req) {
  try {
    await db();

    const { name, email, profilePictureUrl } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing email or name" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    // If user doesn't exist, register
    if (!user) {
      user = await User.create({
        name,
        email,
        profilePictureUrl,
        isEmailVerified: true,
      });
    }

    const token = createToken(user._id);

    // Check if the client is React Native by custom header (recommended)
    const userAgent = req.headers.get("user-agent") || "";
    const isReactNative =
      userAgent.includes("Expo") || userAgent.includes("ReactNative");

    const responseBody = {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePictureUrl,
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
  } catch (err) {
    console.error("Google SignIn error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
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
