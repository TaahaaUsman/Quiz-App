'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { FaBookmark } from 'react-icons/fa6';
import 'react-toastify/dist/ReactToastify.css';

export default function CourseList({ courses = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const notify = (msg) => {
    toast(msg, {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const bookMark = async (courseId, code) => {
    try {
      const response = await fetch('/api/courses/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        notify('Failed to bookmark.');
        return;
      }

      notify(`📌 ${code} Bookmarked`);
    } catch (error) {
      console.log('Error in bookmark function', error);
      notify('An error occurred.');
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pl-8 md:pl-0 pr-2 md:pr-0 md:px-8 lg:px-12 xl:px-20">
      <ToastContainer />
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">Available Courses</h1>

        <div className="flex space-x-2 justify-end mb-6">
          <input
            type="text"
            placeholder="Search by code or title"
            className="border border-gray-300 rounded px-3 py-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            onClick={() => {}}
          >
            Search
          </button>
        </div>

        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-white px-4 py-2">Sr No</th>
              <th className="border border-white px-4 py-2">Code</th>
              <th className="border border-white px-4 py-2">Title</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course, index) => (
              <tr key={course._id || index}>
                <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <Link href={`/courses/${course._id}`} className="text-blue-500 hover:underline">
                    {course.code}
                  </Link>
                </td>
                <td className="border border-gray-200 px-4 py-2 flex items-center justify-between">
                  <Link href={`/courses/${course._id}`} className="text-blue-500 hover:underline">
                    {course.title}
                  </Link>
                  <div className="cursor-pointer ml-4" onClick={() => bookMark(course._id, course.code)}>
                    <FaBookmark style={{ width: 20, height: 20 }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
