// app/api/admin/quizzes/stats/route.js
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

    // total quizzes
    const total = await Quiz.countDocuments();

    // avg questions per quiz
    const avgResult = await Quiz.aggregate([
      { $project: { numQuestions: { $size: "$questions" } } },
      { $group: { _id: null, avg: { $avg: "$numQuestions" } } },
    ]);
    const averageQuestions = avgResult[0]?.avg || 0;

    // quizzes by type
    const byType = await Quiz.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // quizzes per course (top 10)
    const byCourse = await Quiz.aggregate([
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      success: true,
      total,
      averageQuestions,
      byType,
      byCourse,
    });
  } catch (err) {
    console.log("❌ Error in stats in quiz (admin):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
