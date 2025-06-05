import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import User from "../../../../database/models/userModel/userSchema";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function GET(req) {
  await db();

  // Admin auth check
  const isAdmin = await checkAdminAuth();
  if (!isAdmin.success) return isAdmin;

  try {
    const totalUsers = await User.countDocuments();

    const verifiedEmails = await User.countDocuments({ isEmailVerified: true });

    const subscribedUsers = await User.countDocuments({
      subscriptionStatus: "active",
    });

    const upcomingExpiries = await User.countDocuments({
      subscriptionEndDate: {
        $gte: new Date(),
        $lte: new Date(new Date().setDate(new Date().getDate() + 7)), // within next 7 days
      },
    });

    // Monthly signup stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // start from the beginning of the month

    const monthlyStats = await User.aggregate([
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
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Format months
    const formattedStats = monthlyStats.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      total: item.total,
    }));

    return NextResponse.json({
      success: true,
      totalUsers,
      verifiedEmails,
      subscribedUsers,
      upcomingExpiries,
      monthlySignups: formattedStats,
    });
  } catch (error) {
    console.error("Error in user stats route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
