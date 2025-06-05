import { cookies } from "next/headers";
import { verifyToken } from "../utils/jwt";
import User from "../database/models/userModel/userSchema";
import db from "../database/lib/db";

export const authenticate = async () => {
  await db();

  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-passwordHash");
    return user;
  } catch (err) {
    return null;
  }
};
