import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "../../../utils/sendEmail";

export async function POST(request) {
  try {
    await db();
    const { email } = await request.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // valid for 15 mins

    user.emailVerificationCode = otp;
    user.emailVerificationExpiry = expiry;
    await user.save();

    // Send OTP to user
    await sendVerificationEmail(email, otp);

    // Setting the cookie which just set email address for verification use
    cookies().set("verifyEmail", user.email, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60, // 15 mins
    });

    return NextResponse.json({ message: "OTP sent to email" }, { status: 200 });
  } catch (err) {
    console.log("❌ Error in forget-password API:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
