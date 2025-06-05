// app/api/admin/courses/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function POST(request) {
  await db();

  // 1️⃣ Auth check
  const auth = await checkAdminAuth();
  if (!auth.success) return auth;

  // 2️⃣ Parse and validate input
  const {
    code,
    title,
    description,
    categoryId,
    thumbnailUrl,
    voiceNoteUrl,
    handoutUrl,
  } = await request.json();

  if (!code || !title || !categoryId) {
    return NextResponse.json(
      { success: false, error: "code, title and categoryId are required" },
      { status: 400 }
    );
  }

  try {
    // 3️⃣ Create the course
    const newCourse = await Course.create({
      code: code.trim(),
      title: title.trim(),
      description: description?.trim() || "",
      categoryId,
      thumbnailUrl: thumbnailUrl || "",
      voiceNoteUrl: voiceNoteUrl || "",
      handoutUrl: handoutUrl || "",
    });

    // 4️⃣ Return success
    return NextResponse.json(
      { success: true, data: newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating course:", error);
    // Handle duplicate code error
    if (error.code === 11000 && error.keyPattern?.code) {
      return NextResponse.json(
        { success: false, error: "Course code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
