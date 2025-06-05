import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Submission from "../../../../database/models/submissionModel/submissionModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  try {
    await db();
    const auth = await checkAdminAuth();
    if (!auth.success)
      return NextResponse.json({ error: auth.error }, { status: 401 });

    // total submissions
    const totalSubmissions = await Submission.countDocuments();

    // average score
    const avgRes = await Submission.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);
    const averageScore = avgRes[0]?.avgScore || 0;

    // count & avg per quiz
    const byQuiz = await Submission.aggregate([
      {
        $group: {
          _id: "$quizId",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // monthly submissions (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthly = await Submission.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
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
    const monthLabels = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString("default", { month: "short", year: "numeric" }),
      };
    });
    const monthlySubmissions = monthLabels.map(({ year, month, label }) => {
      const m = monthly.find(
        (x) => x._id.year === year && x._id.month === month
      );
      return { month: label, count: m ? m.count : 0 };
    });

    return NextResponse.json({
      success: true,
      totalSubmissions,
      averageScore,
      byQuiz,
      monthlySubmissions,
    });
  } catch (err) {
    console.log("❌ Error in getting stats of submission admin:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
