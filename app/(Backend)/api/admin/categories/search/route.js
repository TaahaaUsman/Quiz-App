// app/api/admin/categories/search/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Category from "../../../../database/models/categoryModel/categoryModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(request) {
  await db();
  const auth = await checkAdminAuth();
  if (!auth.success)
    return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("query");
  if (!q) {
    return NextResponse.json(
      { success: false, error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const regex = new RegExp(q.trim(), "i");
    const categories = await Category.find({ name: { $regex: regex } });
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error searching categories:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
