import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Course from "../../../database/models/coursesModel/coursesModel";

// POST /api/courses/bulk
export async function POST(request) {
  try {
    await db();
    const { coursesArray } = await request.json(); // Assume the body contains an array of course objects

    console.log(coursesArray);

    // Basic validation: Check if courses array is provided
    if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
      return NextResponse.json(
        { error: "No courses provided" },
        { status: 400 }
      );
    }

    // Insert each course using a loop
    const insertedCourses = [];
    for (const courseData of coursesArray) {
      const { code, title, categoryId } = courseData;

      // Validation for each course
      if (!code || !title || !categoryId) {
        return NextResponse.json(
          { error: "Code, title, and categoryId are required for each course" },
          { status: 400 }
        );
      }

      const newCourse = new Course({
        code,
        title,
        categoryId,
      });

      await newCourse.save();
      insertedCourses.push(newCourse);
    }

    // Respond with the inserted courses
    return NextResponse.json(insertedCourses, { status: 201 });
  } catch (err) {
    console.error("❌ Error inserting multiple courses:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
