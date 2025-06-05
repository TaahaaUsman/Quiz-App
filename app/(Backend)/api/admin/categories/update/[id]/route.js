import { NextResponse } from "next/server";
import db from "../../../../../database/lib/db";
import Category from "../../../../../database/models/categoryModel/categoryModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";

export async function PUT(request, { params }) {
  await db();

  // 🛡️ Auth
  const auth = await checkAdminAuth();
  if (!auth.success)
    return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = params;
  const { name } = await request.json();
  if (!name) {
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await Category.findByIdAndUpdate(
      id,
      { $set: { name: name.trim() } },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("Error updating category:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Name already in use" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
