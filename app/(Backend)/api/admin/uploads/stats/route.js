// app/(Backend)/api/admin/uploads/stats/route.js
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

    const totalUploads = await Upload.countDocuments();

    const uploadsByMonth = await Upload.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] }, // "YYYY-MM"
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return Response.json({
      success: true,
      stats: {
        totalUploads,
        uploadsByMonth,
      },
    });
  } catch (err) {
    console.log("❌ Error in creation of user by admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
