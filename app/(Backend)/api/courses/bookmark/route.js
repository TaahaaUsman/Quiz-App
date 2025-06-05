// app/api/courses/search/route.js
import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Course from "../../../database/models/coursesModel/coursesModel";
import User from "../../../database/models/userModel/userSchema";
import { verifyToken } from "../../../utils/jwt";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await db();

    const { courseId } = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!courseId) {
      return NextResponse.json(
        { error: "Please send courseId first" },
        { status: 401 }
      );
    }

    const courseExist = await Course.findOne({ _id: courseId });

    if (!courseExist) {
      return NextResponse.json(
        { error: "Course does not exist" },
        { status: 401 }
      );
    }

    // Verify token and extract user ID
    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id; // depending on your token payload

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

    // Add to bookmarks without duplicates
    user.bookmarkedCourses.addToSet(courseId);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Bookmarked" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error during getting details of course:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
