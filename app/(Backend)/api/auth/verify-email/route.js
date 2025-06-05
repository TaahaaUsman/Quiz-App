import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createToken } from "../../../utils/jwt";

export async function POST(request) {
  try {
    await db();

    const email = cookies().get("verifyEmail")?.value;
    const { code } = await request.json();
    const cookieStore = cookies();

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in session" },
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

    // Setting cookie

    const token = createToken(user._id);

    const cookie = await cookies();
    cookie.set("token", token, {
      httpOnly: true, // not accessible via js (xss safe)
      secure: process.env.NODE_ENV === "production", // only sent over HTTPS
      maxAge: 30 * 24 * 60 * 60, // long lasting 30 days
      sameSite: "strict", // blocks CSRF
      path: "/",
    });

    // 🧼 Clean up verifyEmail cookie
    cookie.delete("verifyEmail");

    return NextResponse.json(
      { message: "Email verified & logged in" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error verifying email : ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
