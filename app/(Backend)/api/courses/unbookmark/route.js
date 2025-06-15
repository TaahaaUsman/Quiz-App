import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import User from "../../../database/models/userModel/userSchema";
import { verifyToken } from "../../../utils/jwt";
import { cookies } from "next/headers";

export async function DELETE(request) {
  try {
    await db();

    const cookieStore = await cookies();
    const authHeader = request.headers.get("authorization");
    const userAgent = request.headers.get("user-agent") || "";
    const isReactNative =
      userAgent.includes("Expo") || userAgent.includes("ReactNative");

    let token;

    if (isReactNative) {
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    } else {
      token = cookieStore.get("token")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Please provide a courseId" },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token or user ID missing in token" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove the courseId from the bookmarkedCourses array
    user.bookmarkedCourses = user.bookmarkedCourses.filter(
      (id) => id.toString() !== courseId
    );

    await user.save();

    return NextResponse.json(
      { success: true, message: "Course unbookmarked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error during unbookmarking course:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
