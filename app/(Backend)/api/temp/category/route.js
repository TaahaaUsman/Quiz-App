import { NextResponse } from "next/server";
import db from "../../../database/lib/db";
import Category from "../../../database/models/categoryModel/categoryModel";

export async function POST(request) {
  try {
    await db();

    const { name } = await request.json();

    // 🛡️ Basic validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // 🛑 Optional: prevent duplicate names
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    // ✅ Create and save category
    const category = new Category({ name: name.trim() });
    await category.save();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await db();

    // 🛑 Optional: prevent duplicate names
    const existing = await Category.find().select(
      "-upadatedAt, -createdAt, -__v"
    );
    const length = existing.length;

    console.log(length);
    if (!existing) {
      return NextResponse.json(
        { error: "Something went wrongt" },
        { status: 409 }
      );
    }
    return NextResponse.json(existing, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
