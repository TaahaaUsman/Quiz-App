import db from "../../../../database/lib/db";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { NextResponse } from "next/server";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET() {
  try {
    await db(); // connect to DB

    const authResult = await checkAdminAuth();
    if (!authResult.success) return authResult;

    const courses = await Course.find();

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: "No course added yet" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
