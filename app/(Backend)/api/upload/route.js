import { NextResponse } from "next/server";
import db from "../../database/lib/db";
import { verifyToken } from "../../utils/jwt";
import { cookies } from "next/headers";
import Upload from "../../database/models/uploadModel/uploadModel";

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

    const formData = await request.json();
    const { uploadedFiles, description } = formData;

    if (!uploadedFiles || !description) {
      d;
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newUpload = await Upload.create({
      userId,
      uploadedFiles,
      description,
    });

    return NextResponse.json(
      { success: true, message: "Query submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading query:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
