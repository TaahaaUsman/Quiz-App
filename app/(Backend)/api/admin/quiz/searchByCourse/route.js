// app/api/admin/quizzes/search/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Quiz from "../../../../database/models/quizModel/quizModel";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const courseCode = searchParams.get("courseCode");

    let filter = {};

    if (courseId) {
      filter.courseId = courseId;
    } else if (courseCode) {
      const course = await Course.findOne({ code: courseCode.trim() });

      if (!course) {
        return NextResponse.json(
          { success: false, message: "Course not found" },
          { status: 404 }
        );
      }
      filter.courseId = course._id;
    } else {
      return NextResponse.json(
        { success: false, error: "Provide courseId or courseCode" },
        { status: 400 }
      );
    }

    const quizzes = await Quiz.find(filter).populate("courseId", "code title");
    return NextResponse.json({ success: true, data: quizzes });
  } catch (err) {
    console.log("❌ Error in SearchByCourse (Admin):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
