// app/api/courses/search/route.js
// import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Course from "../../../database/models/coursesModel/coursesModel";

export async function POST(request) {
  try {
    await db();

    const { courseId } = await request.json();

    if (!courseId) {
      return createCORSResponse({ error: "Please send courseId first" }, 401);
    }

    const courseExist = await Course.findOne({ _id: courseId });

    if (!courseExist) {
      return createCORSResponse({ error: "Course does not exist" }, 401);
    }

    return createCORSResponse({ success: true, data: courseExist }, 200);
  } catch (error) {
    console.error("❌ Error during getting details of course:", error);
    return createCORSResponse(
      { success: false, message: "Internal Server Error" },
      500
    );
  }
}

// Handle OPTIONS request for preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getCORSHeaders(),
  });
}

// Utility: Add CORS headers to response
function getCORSHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Replace * with specific domain in prod
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
