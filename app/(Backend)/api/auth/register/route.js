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

    // ✅ 1. Input validation (basic)
    if (!name || !username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ 2. Check both passwords are same
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Both password should be same" },
        { status: 400 }
      );
    }

    // ✅ 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // ✅ 4. Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken please choose new one" },
        { status: 409 }
      );
    }

    // ✅ 5. Hash password
    const salt = await bcrypt.genSalt(11);
    const passwordHash = await bcrypt.hash(password, salt);

    // ✅ 6. Create and save new user
    const newUser = new User({
      name,
      username,
      email,
      passwordHash,
    });

    await newUser.save();

    // Creating OTP and sending to the client
    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    newUser.emailVerificationCode = otp;
    newUser.emailVerificationExpiry = expiry;
    await newUser.save();

    await sendVerificationEmail(email, otp);

    // Setting the cookie which just set email address for verification use
    const cookie = await cookies();
    cookie.set("verifyEmail", newUser.email, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60, // 15 mins
    });

    // ✅ 7. Send success response
    return NextResponse.json(
      { message: "User registered and waiting for email verification" },
      { status: 201 }
    );
  } catch (err) {
    console.log("❌ Error in Register API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
