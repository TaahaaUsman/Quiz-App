// app/api/quiz/fetch/route.js
// import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Quiz from "../../../database/models/quizModel/quizModel";
import Course from "@/app/(Backend)/database/models/coursesModel/coursesModel";

export async function POST(request) {
  try {
    await db();

    const { courseId, type } = await request.json();

    if (!courseId || !type) {
      return createCORSResponse(
        { error: "courseId and type are required" },
        400
      );
    }

    const quiz = await Quiz.findOne({ courseId, type });

    if (!quiz) {
      return createCORSResponse(
        { error: "No quiz found for this course and type" },
        404
      );
    }

    const courseDetails = await Course.findOne({ _id: courseId })
      .select("-_id -categoryId -createdAt -updatedAt -__v")
      .lean();

    if (!courseDetails) {
      return createCORSResponse({ error: "No Course found" }, 404);
    }

    return createCORSResponse(
      { success: true, questions: quiz.questions, courseDetails },
      200
    );
  } catch (error) {
    console.error("❌ Error fetching quiz questions:", error);
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
