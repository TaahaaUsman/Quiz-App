import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Course from "../../../database/models/coursesModel/coursesModel";
import User from "../../../database/models/userModel/userSchema";
import { verifyToken } from "../../../utils/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await db();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    // Verify token and extract user ID
    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token or user ID missing in token" },
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bookmarkedCourseIds = user.bookmarkedCourses;

    if (!bookmarkedCourseIds || bookmarkedCourseIds.length === 0) {
      return NextResponse.json(
        { error: "No bookmarked courses found" },
        { status: 404 }
      );
    }

    const courses = await Course.find({
      _id: { $in: bookmarkedCourseIds },
    });

    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error("❌ Error while fetching bookmarked courses:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
