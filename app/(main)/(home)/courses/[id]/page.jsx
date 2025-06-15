import { notFound } from "next/navigation";
import CourseDetailsButton from "@/components/CourseDetailsButton";

const getCourseDetails = async (courseId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/getCourseDetails`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
        cache: "no-store",
      }
    );

    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Server fetch error:", err);
    return null;
  }
};

const Page = async ({ params }) => {
  const { id: courseId } = await params;
  const course = await getCourseDetails(courseId);

  if (!course) return notFound();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title and Course Code Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2 text-gradient">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600">
            Course Code: <strong>{course.code}</strong>
          </p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Quiz Section - Small */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-1 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">
            Quiz Section
          </h2>
          <CourseDetailsButton courseId={course._id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
