// app/(Backend)/api/admin/uploads/getAll/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Upload from "../../../../database/models/uploadModel/uploadModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  try {
    await db();

    // 1️⃣ Admin check
    const auth = await checkAdminAuth();
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const uploads = await Upload.find()
      .populate("userId", "name email") // Populate user info if needed
      .sort({ createdAt: -1 }); // Latest first

    return Response.json({ success: true, uploads });
  } catch (err) {
    console.log("❌ Error in creation of user by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
