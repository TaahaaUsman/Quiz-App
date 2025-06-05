// app/api/quiz/fetch/route.js
import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Quiz from "../../../database/models/quizModel/quizModel";
import Course from "@/app/(Backend)/database/models/coursesModel/coursesModel";

export async function POST(request) {
  try {
    await db();

    const { courseId, type } = await request.json();

    if (!courseId || !type) {
      return NextResponse.json(
        { error: "courseId and type are required" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findOne({ courseId, type });

    if (!quiz) {
      return NextResponse.json(
        { error: "No quiz found for this course and type" },
        { status: 404 }
      );
    }

    const courseDetails = await Course.findOne({ _id: courseId })
      .select("-_id -categoryId -createdAt -updatedAt -__v")
      .lean();

    if (!courseDetails) {
      return NextResponse.json({ error: "No Course found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, questions: quiz.questions, courseDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching quiz questions:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
