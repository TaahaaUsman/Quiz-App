import { NextResponse } from "next/server";
import db from "../../../../../database/lib/db";
import Submission from "../../../../../database/models/submissionModel/submissionModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";

export async function DELETE(req, { params }) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    const { id } = params;
    const deleted = await Submission.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.log("❌ Error in deletion of submission by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
