import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import User from "../../../../database/models/userModel/userSchema";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  await db();

  const authResult = await checkAdminAuth();
  if (!authResult.success) return authResult;

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Search error in getting one User:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
