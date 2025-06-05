import { CourseList } from "@/components";
import { headers } from "next/headers";

const getCourseList = async () => {
  const headersList = await headers(); 
  const cookie = headersList.get("cookie") || "";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`, {
      headers: { Cookie: cookie },
      next: {
        revalidate: 86400, // cache for 1 day (60 * 60 * 24 seconds)
      },
    });

    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("Server fetch error:", err);
    return [];
  }
};

const Page = async () => {
  const courses = await getCourseList();
  return <CourseList courses={courses} />;
};

export default Page;
