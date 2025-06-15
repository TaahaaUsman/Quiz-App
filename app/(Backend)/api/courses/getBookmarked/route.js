import db from "../../../database/lib/db";
import Course from "../../../database/models/coursesModel/coursesModel";
import User from "../../../database/models/userModel/userSchema";
import { verifyToken } from "../../../utils/jwt";
import { cookies, headers } from "next/headers";

export async function GET() {
  try {
    await db();

    // Get token from cookie (web) OR Authorization header (Expo)
    const cookieStore = await cookies();
    const headerStore = await headers();

    let token = cookieStore.get("token")?.value;

    if (!token) {
      const authHeader = headerStore.get("Authorization"); // e.g., Bearer <token>
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return createCORSResponse({ error: "Unauthorized: Token missing" }, 401);
    }

    // Verify token and extract user ID
    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id;

    if (!userId) {
      return createCORSResponse(
        { error: "Invalid token or user ID missing in token" },
        401
      );
    }

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return createCORSResponse({ error: "User not found" }, 404);
    }

    const bookmarkedCourseIds = user.bookmarkedCourses;

    if (!bookmarkedCourseIds || bookmarkedCourseIds.length === 0) {
      return createCORSResponse({ error: "No bookmarked courses found" }, 404);
    }

    const courses = await Course.find({
      _id: { $in: bookmarkedCourseIds },
    });

    return createCORSResponse({ success: true, data: courses }, 200);
  } catch (error) {
    console.error("❌ Error while fetching bookmarked courses:", error);
    return createCORSResponse(
      { success: false, message: "Internal Server Error" },
      500
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getCORSHeaders(),
  });
}

function getCORSHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Replace with your domain in production
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function createCORSResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCORSHeaders(),
      "Content-Type": "application/json",
    },
  });
}
