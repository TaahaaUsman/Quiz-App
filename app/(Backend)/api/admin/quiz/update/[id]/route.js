// app/api/admin/quizzes/[id]/route.js
import { NextResponse } from "next/server";
import db from "../../../../../database/lib/db";
import Quiz from "../../../../../database/models/quizModel/quizModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";

export async function PUT(req, { params }) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { id } = params;
    const updates = await req.json(); // expect any of courseId, type, questions

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: quiz });
  } catch (err) {
    console.log("❌ Error in update quiz (admin):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
