import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HomePage } from "@/components";

export default async function Page() {
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  // ⏱️ Call both APIs at the same time
  const [resUser, resCourses] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/getUser`, {
      cache: "no-store",
      headers: { Cookie: cookie },
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/getBookmarked`, {
      cache: "no-store",
      headers: { Cookie: cookie },
    }),
  ]);

  // ⛔ Redirect if user is not valid
  if (!resUser.ok) return redirect("/auth/login");

  const user = await resUser.json();
  if (!user) return redirect("/auth/login");

  const courses = resCourses.ok ? await resCourses.json() : [];

  return <HomePage user={user} bookmarkedCourses={courses?.data || []} />;
}
