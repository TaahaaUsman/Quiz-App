import { headers } from "next/headers";
import { HomePage } from "@/components";

export default async function Page({ user }) {
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  // ⏱️ Call both APIs at the same time
  const [resCourses] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/getBookmarked`, {
      cache: "no-store",
      headers: { Cookie: cookie },
    }),
  ]);
  const courses = resCourses.ok ? await resCourses.json() : [];

  return <HomePage bookmarkedCourses={courses?.data || []} />;
}
