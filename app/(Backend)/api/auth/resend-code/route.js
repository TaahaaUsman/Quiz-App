import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { sendVerificationEmail } from "../../../utils/sendEmail";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // 6 digit
}

export async function POST() {
  try {
    await db();
    const cookieStore = await cookies();
    const verifyCookie = cookieStore.get("verifyEmail");

    if (!verifyCookie) {
      return NextResponse.json(
        { error: "No verification session" },
        { status: 400 }
      );
    }

    const email = verifyCookie.value;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    const newOTP = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationCode = newOTP;
    user.emailVerificationExpiry = expiry;
    await user.save();

    await sendVerificationEmail(email, newOTP);

    return NextResponse.json(
      { message: "OTP resent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("❌ Resend OTP error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
