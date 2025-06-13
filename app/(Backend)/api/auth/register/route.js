import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "../../../utils/sendEmail";

export async function POST(request) {
  try {
    await db();
    const { name, username, email, password, confirmPassword } =
      await request.json();

    // Check for React Native client
    const userAgent = request.headers.get("user-agent") || "";
    const isReactNative =
      userAgent.includes("Expo") || userAgent.includes("ReactNative");

    // 1. Input validation
    if (!name || !username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 2. Password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Both passwords should be the same" },
        { status: 400 }
      );
    }

    // 3. Existing user check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // 4. Existing username check
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(11);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Create user
    const newUser = new User({
      name,
      username,
      email,
      passwordHash,
    });

    // 7. OTP generation and assignment
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    newUser.emailVerificationCode = otp;
    newUser.emailVerificationExpiry = expiry;
    await newUser.save();

    // 8. Send OTP email
    await sendVerificationEmail(email, otp);

    // 9. Set cookie only for browser
    if (!isReactNative) {
      const cookieStore = await cookies();
      cookieStore.set("verifyEmail", email, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        maxAge: 15 * 60, // 15 mins
        path: "/",
      });
    }

    return NextResponse.json(
      { message: "User registered and waiting for email verification" },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Register API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CORS handler
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
