// app/api/admin/verify/route.js
import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Admin from "../../../database/models/Admin/admin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_ADMIN_SECRET;

export async function POST(request) {
  try {
    await db();
    const { email, code } = await request.json();

    const admin = await Admin.findOne({ email });
    if (
      !admin ||
      admin.emailVerificationCode !== code ||
      admin.emailVerificationExpiry < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign({ role: "admin", id: admin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    cookies().set("token", "");
    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Reset verification fields
    admin.emailVerificationCode = null;
    admin.emailVerificationExpiry = null;
    await admin.save();

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
