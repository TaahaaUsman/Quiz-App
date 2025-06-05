// app/api/courses/search/route.js
import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Course from "../../../database/models/coursesModel/coursesModel";

export async function POST(request) {
  try {
    await db();

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Please send courseId first" },
        { status: 401 }
      );
    }

    const courseExist = await Course.findOne({ _id: courseId });

    if (!courseExist) {
      return NextResponse.json(
        { error: "Course does not exist" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, data: courseExist },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error during getting details of course:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
