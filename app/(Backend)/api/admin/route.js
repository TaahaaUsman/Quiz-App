// app/api/admin/create/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../database/lib/db"; // adjust if path differs
import Admin from "../../database/models/Admin/admin"; // adjust if path differs

export async function POST(req) {
  try {
    await db();

    const { name, email, password1, password2, password3 } = await req.json();

    if (!email || !password1 || !password2 || !password3 || !name) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Admin already exists." },
        { status: 400 }
      );
    }

    const passwordHash1 = await bcrypt.hash(password1, 12);
    const passwordHash2 = await bcrypt.hash(password2, 11);
    const passwordHash3 = await bcrypt.hash(password3, 10);

    const admin = await Admin.create({
      name,
      email,
      password1: passwordHash1,
      password2: passwordHash2,
      password3: passwordHash3,
      isSuperAdmin: true,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully.",
      admin,
    });
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
