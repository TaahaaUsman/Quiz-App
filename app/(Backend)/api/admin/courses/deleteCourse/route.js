// app/api/admin/courses/delete/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function POST(request) {
  await db();

  // 1️⃣ Admin auth
  const auth = await checkAdminAuth();
  if (!auth.success) return auth;

  // 2️⃣ Parse body
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    // 3️⃣ Delete
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Return deleted ID
    return NextResponse.json(
      { success: true, deletedId: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
