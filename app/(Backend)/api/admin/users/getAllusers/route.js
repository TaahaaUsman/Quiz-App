// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import User from "../../../../database/models/userModel/userSchema";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  await db();

  const authResult = await checkAdminAuth();
  if (!authResult.success) return authResult;

  try {
    const users = await User.find().select("-password"); // hide password
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
