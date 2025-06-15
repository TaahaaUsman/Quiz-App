import db from "../../database/lib/db";
import Course from "../../database/models/coursesModel/coursesModel";
// import { NextResponse } from "next/server";

export async function GET() {
  try {
    await db(); // connect to DB

    const courses = await Course.find().select("-createdAt, -updatedAt, -__v");

    if (!courses || courses.length === 0) {
      return createCORSResponse({ error: "No course added yet" }, 500);
    }

    return createCORSResponse({ success: true, data: courses }, 200);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
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
