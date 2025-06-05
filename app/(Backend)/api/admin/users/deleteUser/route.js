// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import User from "../../../../database/models/userModel/userSchema";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function POST(req) {
  await db();

  const authResult = await checkAdminAuth();
  if (!authResult.success) return authResult;

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Please enter Id first",
      });
    }

    let deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({
        success: false,
        error: "User does not exist in database",
      });
    }
    return NextResponse.json({
      success: true,
      message: "User deleted",
      deletedUser,
    });
  } catch (error) {
    console.log("Error in deletion of User by admin", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
