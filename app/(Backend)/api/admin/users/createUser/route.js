import db from "../../../../database/lib/db";
import User from "../../../../database/models/userModel/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function POST(request) {
  try {
    await db();

    const authResult = await checkAdminAuth();
    if (!authResult.success) return authResult;

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

    return NextResponse.json(
      { message: "User Created by admin" },
      { status: 201 }
    );
  } catch (err) {
    console.log("❌ Error in creation of user by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
