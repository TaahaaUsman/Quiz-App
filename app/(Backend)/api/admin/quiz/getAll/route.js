// app/api/admin/quizzes/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Quiz from "../../../../database/models/quizModel/quizModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const type = searchParams.get("type");

    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (type) filter.type = type;

    const quizzes = await Quiz.find(filter).populate("courseId", "code title");
    return NextResponse.json({ success: true, data: quizzes });
  } catch (err) {
    console.log("❌ Error in getting All quizzes:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
