import { NextResponse } from "next/server";
import db from "../../../../../database/lib/db";
import Quiz from "../../../../../database/models/quizModel/quizModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";

export async function DELETE(req, { params }) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { id } = params;
    const deleted = await Quiz.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.log("❌ Error in delete api Quiz (admin):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
