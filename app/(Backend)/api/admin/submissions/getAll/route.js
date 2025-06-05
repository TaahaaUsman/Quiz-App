// app/api/admin/submissions/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Submission from "../../../../database/models/submissionModel/submissionModel";
import User from "../../../../database/models/userModel/userSchema";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const quizId = searchParams.get("quizId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (userId) filter.userId = userId;
    if (quizId) filter.quizId = quizId;

    const [total, submissions] = await Promise.all([
      Submission.countDocuments(filter),
      Submission.find(filter)
        .populate("userId", "name email")
        .populate("quizId", "type courseId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: { total, page, limit },
    });
  } catch (err) {
    console.log("❌ Error in getting al submissions by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
