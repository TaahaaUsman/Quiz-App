// app/api/admin/submissions/[id]/route.js
import { NextResponse } from "next/server";
import db from "../../../../../database/lib/db";
import Submission from "../../../../../database/models/submissionModel/submissionModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";
import User from "../../../../../database/models/userModel/userSchema";

export async function GET(req, { params }) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { id } = params;
    const submission = await Submission.findById(id)
      .populate("userId", "name email")
      .populate({
        path: "quizId",
        select: "type courseId",
        populate: { path: "courseId", select: "code title" },
      });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (err) {
    console.log("❌ Error in getting One submission by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
