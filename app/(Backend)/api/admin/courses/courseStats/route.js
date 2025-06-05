// app/api/admin/courses/stats/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Course from "../../../../database/models/coursesModel/coursesModel";
import Category from "../../../../database/models/categoryModel/categoryModel"; // adjust path if needed
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  await db();

  // 1️⃣ Auth
  const auth = await checkAdminAuth();
  if (!auth.success)
    return new Response(JSON.stringify({ error: auth.error }), { status: 401 });

  try {
    // 2️⃣ Total courses
    const totalCourses = await Course.countDocuments();

    // 3️⃣ Breakdown by category
    const byCategoryAgg = await Course.aggregate([
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
        },
      },
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
          count: 1,
        },
      },
    ]);

    // 4️⃣ New courses per month (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyAgg = await Course.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // build month labels array
    const monthLabels = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString("default", { month: "short", year: "numeric" }),
      };
    });

    const monthlyNewCourses = monthLabels.map(({ year, month, label }) => {
      const found = monthlyAgg.find(
        (m) => m._id.year === year && m._id.month === month
      );
      return {
        month: label,
        count: found ? found.count : 0,
      };
    });

    return NextResponse.json({
      success: true,
      totalCourses,
      byCategory: byCategoryAgg,
      monthlyNewCourses,
    });
  } catch (error) {
    console.error("Error fetching course stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
