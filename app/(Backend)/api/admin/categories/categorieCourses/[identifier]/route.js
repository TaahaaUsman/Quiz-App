// app/api/admin/categories/[identifier]/courses/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "../../../../../database/lib/db";
import Category from "../../../../../database/models/categoryModel/categoryModel";
import Course from "../../../../../database/models/coursesModel/coursesModel";
import { checkAdminAuth } from "../../../../../middlewares/admin";

export async function GET(request, { params }) {
  await db();
  const auth = await checkAdminAuth();
  if (!auth.success)
    return NextResponse.json({ error: auth.error }, { status: 401 });

  const { identifier } = params;
  let category;

  try {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      category = await Category.findById(identifier);
    }
    if (!category) {
      // try by name
      category = await Category.findOne({ name: identifier });
    }
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const courses = await Course.find({ categoryId: category._id });
    return NextResponse.json(
      { success: true, data: { category, courses } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching category courses:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
