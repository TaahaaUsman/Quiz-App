import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Quiz from "../../../../database/models/quizModel/quizModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function POST(req) {
  await db();
  const auth = await checkAdminAuth();
  if (!auth.success)
    return NextResponse.json({ error: auth.error }, { status: 401 });

  const { courseId, type, questions } = await req.json();
  if (
    !courseId ||
    !type ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return NextResponse.json(
      { success: false, error: "courseId, type, questions required" },
      { status: 400 }
    );
  }

  try {
    const quiz = await Quiz.create({ courseId, type, questions });
    return NextResponse.json({ success: true, data: quiz }, { status: 201 });
  } catch (err) {
    console.error("Create Quiz error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
