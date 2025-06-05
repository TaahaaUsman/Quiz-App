// app/api/admin/login/route.js
import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Admin from "../../../database/models/Admin/admin";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../utils/sendEmail";

export async function POST(request) {
  try {
    await db();
    const { email, password1, password2, password3 } = await request.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid1 = await bcrypt.compare(password1, admin.password1);
    const isPasswordValid2 = await bcrypt.compare(password2, admin.password2);
    const isPasswordValid3 = await bcrypt.compare(password3, admin.password3);

    if (!isPasswordValid1 || !isPasswordValid2 || !isPasswordValid3) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate email verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    admin.emailVerificationCode = verificationCode;
    admin.emailVerificationExpiry = new Date(expiry);
    await admin.save();

    // Simulate or send email
    await sendVerificationEmail(
      admin.email,
      `Your Admin Login Code: ${verificationCode}`
    );

    return NextResponse.json({
      success: true,
      message: "Verification code sent to email.",
    });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
