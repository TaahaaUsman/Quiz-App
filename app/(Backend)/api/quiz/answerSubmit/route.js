// app/api/quiz/submit/route.js
import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Quiz from "../../../database/models/quizModel/quizModel";
import Submission from "../../../database/models/submissionModel/submissionModel";
import { cookies } from "next/headers";
import { verifyToken } from "../../../utils/jwt";

export async function POST(request) {
  try {
    await db();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, type, attemptedAnswers } = await request.json();

    if (!courseId || !type || !Array.isArray(attemptedAnswers)) {
      return NextResponse.json(
        { error: "Missing courseId, type, or attemptedAnswers" },
        { status: 400 }
      );
    }
    console.log(courseId, type, attemptedAnswers);

    // Get the quiz from DB
    const quiz = await Quiz.findOne({ courseId, type });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found for provided course and type" },
        { status: 404 }
      );
    }

    const totalQuestions = quiz.questions.length;
    let correctCount = 0;
    const report = [];
    const submittedAnswers = [];

    quiz.questions.forEach((question, index) => {
      const selectedOptionIndex = attemptedAnswers[index];
      const isCorrect = selectedOptionIndex === question.correctOptionIndex;

      if (isCorrect) correctCount++;

      report.push({
        index: question.index,
        questionText: question.questionText,
        selectedOptionIndex,
        correctOptionIndex: question.correctOptionIndex,
        isCorrect,
      });

      submittedAnswers.push({
        questionIndex: question.index,
        selectedOptionIndex,
      });
    });

    const score = correctCount;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    // Save submission in DB
    await Submission.create({
      userId,
      quizId: quiz._id,
      submittedAnswers,
      score,
    });

    return NextResponse.json(
      {
        success: true,
        result: {
          totalQuestions,
          correctCount,
          wrongCount: totalQuestions - correctCount,
          percentage,
          report,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("❌ Error submitting quiz answers:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
