import db from "../../../../database/lib/db";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { NextResponse } from "next/server";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function POST(request) {
  try {
    await db(); // Connect to MongoDB

    const authResult = await checkAdminAuth();
    if (!authResult.success) return authResult;

    const { search } = await request.json();

    if (!search) {
      return NextResponse.json(
        { success: false, error: "Enter text first please" },
        { status: 400 }
      );
    }

    const regex = new RegExp(search, "i"); // case-insensitive search

    const courses = await Course.find({
      $or: [{ title: regex }, { code: regex }],
    });

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No matching courses found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error("❌ Error during course search:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
