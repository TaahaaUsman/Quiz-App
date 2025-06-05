// app/(Backend)/middlewares/admin.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function checkAdminAuth() {
  const token = await cookies().get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" });
    }

    return { success: true, admin: decoded };
  } catch (error) {
    console.log("Error in admin middleware :", error);
    return NextResponse.json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}
