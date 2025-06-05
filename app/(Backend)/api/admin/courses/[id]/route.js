// app/api/admin/courses/[id]/route.js
import { NextResponse } from "next/server";
import db from "../../../../database/lib/db";
import Course from "../../../../database/models/coursesModel/coursesModel";
import { checkAdminAuth } from "../../../../middlewares/admin";

export async function PUT(request, { params }) {
  await db();

  // 1️⃣ Auth
  const auth = await checkAdminAuth();
  if (!auth.success) return auth;

  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Course ID is required" },
      { status: 400 }
    );
  }

  // 2️⃣ Parse body
  const {
    code,
    title,
    description,
    categoryId,
    thumbnailUrl,
    voiceNoteUrl,
    handoutUrl,
  } = await request.json();

  // 3️⃣ Build an “update” object only with fields that are defined
  const updates = {};
  if (code !== undefined) updates.code = code.trim();
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (categoryId !== undefined) updates.categoryId = categoryId;
  if (thumbnailUrl !== undefined) updates.thumbnailUrl = thumbnailUrl;
  if (voiceNoteUrl !== undefined) updates.voiceNoteUrl = voiceNoteUrl;
  if (handoutUrl !== undefined) updates.handoutUrl = handoutUrl;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "No fields provided to update" },
      { status: 400 }
    );
  }

  try {
    // 4️⃣ Find and update
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedCourse },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating course:", err);

    // handle duplicate code
    if (err.code === 11000 && err.keyPattern?.code) {
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
