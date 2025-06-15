"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { CiBookmark } from "react-icons/ci";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./UserProvider";

export default function HomeClient({ bookmarkedCourses: initialCourses }) {
  const [bookmarkedCourses, setbookmarkedCourses] = useState(initialCourses);
  const user = useAuth();

  const notify = (message) =>
    toast(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const unBookMark = async (courseId, code) => {
    try {
      const res = await fetch("/api/courses/unbookmark", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        console.error("Failed to unbookmark");
        return;
      }

      setbookmarkedCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
      notify(`🗑️ ${code} Removed from bookmarked`);
    } catch (err) {
      console.error("Unbookmark failed");
    }
  };

  return (
    <div className="px-6 py-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h1>

      {bookmarkedCourses.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-16">
          <p className="text-lg text-gray-600 mb-4">
            😕 No bookmark added yet!
          </p>
          <Link
            href="/courses"
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          >
            🔍 Search Courses
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border border-white px-4 py-2">Sr No</th>
                <th className="border border-white px-4 py-2">Code</th>
                <th className="border border-white px-4 py-2">Title</th>
              </tr>
            </thead>
            <tbody>
              {bookmarkedCourses.map((course, index) => (
                <tr key={course._id}>
                  <td className="border border-gray-200 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <Link
                      href={`/courses/${course._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {course.code}
                    </Link>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 flex items-center justify-between">
                    <Link
                      href={`/courses/${course._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {course.title}
                    </Link>
                    <div
                      className="cursor-pointer"
                      onClick={() => unBookMark(course._id, course.code)}
                    >
                      <CiBookmark size={22} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
