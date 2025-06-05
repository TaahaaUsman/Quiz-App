// app/api/admin/categories/stats/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Category from "../../../../database/models/categoryModel/categoryModel";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(request) {
  await db();
  const auth = await checkAdminAuth();
  if (!auth.success)
    return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    // 1. Total categories
    const totalCategories = await Category.countDocuments();

    // 2. Courses per category
    const breakdown = await Course.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      {
        $lookup: {
          from: Category.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: "$category.name",
          courseCount: "$count",
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        totalCategories,
        byCategory: breakdown,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching category stats:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
