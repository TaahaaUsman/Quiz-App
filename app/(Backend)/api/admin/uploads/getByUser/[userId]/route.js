// app/api/admin/uploads/user/[userId]/route.js
import { NextResponse } from "next/server";
import db from "../../../../../database/lib/db";
import Upload from "../../../../../database/models/uploadModel/uploadModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";

export async function GET(req, { params }) {
  try {
    await db();

    // 1️⃣ Admin check
    const auth = await checkAdminAuth();
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // 2️⃣ Validate param
    const { userId } = params;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId parameter is required" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch uploads
    const uploads = await Upload.find({ userId }).sort({ createdAt: -1 });

    // 4️⃣ Return result
    return NextResponse.json({ success: true, uploads }, { status: 200 });
  } catch (err) {
    console.log("❌ Error in creation of user by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
