'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pdf } from '../assets/Images';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CourseDetailsPage({ id }) {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const courseId = id;

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const response = await fetch("/api/courses/getCourseDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseId
            }),
          });

        const data = await response.json();
        const actualData = data.data;
        setCourse(actualData);
      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseDetails();
  }, [courseId]);

  const handleDownload = () => {
    window.open('/cs609.html', '_blank');
  };

  const handleQuizRedirect = (type) => {
    router.push(`/quiz/${type}/${courseId}`);
  };

  if (loading) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Skeleton for Title and Code */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="text-center md:text-left w-full">
          <Skeleton height={40} width={250} />
          <Skeleton height={20} width={150} className="mt-2" />
        </div>
      </div>

      {/* Bento Grid Skeleton Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              bg-white p-8 rounded-lg shadow-xl
              ${i === 0 || i === 3 ? 'col-span-2 sm:col-span-1' : 'col-span-1 sm:col-span-1'}
            `}
          >
            <Skeleton height={28} width={180} className="mb-4" />

            {i === 0 ? (
              // Handout (image + button)
              <div className="flex items-center justify-between gap-4">
                <Skeleton width={64} height={64} />
                <Skeleton height={40} width={160} />
              </div>
            ) : (
              // Button-style skeletons for other cards
              <div className="flex flex-col gap-3">
                <Skeleton height={40} />
                {(i === 1 || i === 3) && <Skeleton height={40} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

  if (!course) return <p className="p-4 text-red-500">Course not found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title and Course Code Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2 text-gradient">{course.title}</h1>
          <p className="text-lg text-gray-600">Course Code: <strong>{course.code}</strong></p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Handout Section - Large */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-2 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Handout</h2>
          <div className="flex items-center justify-between">
            <Image 
              src={pdf}
              alt="Handout Preview"
              className="w-16 h-16"
            />
            <button 
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200"
            >
              View & Download Handout
            </button>
          </div>
        </div>

        {/* Quiz Section - Small */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-1 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">Quiz Section</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => handleQuizRedirect('midterm')}
              className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-200"
            >
              Midterm Quiz
            </button>
            <button 
              onClick={() => handleQuizRedirect('finalterm')}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Finalterm Quiz
            </button>
          </div>
        </div>

        {/* Short Notes Section - Medium */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-1 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-500">Short Notes</h2>
          <button 
            onClick={() => router.push(`/short-notes/${courseId}`)}
            className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all duration-200"
          >
            View Short Notes
          </button>
        </div>

        {/* Voice Notes Section - Large */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-2 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-teal-500">Voice Notes</h2>
          <button 
            onClick={() => router.push(`/voice-notes/${courseId}`)}
            className="w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200"
          >
            Listen to Voice Notes
          </button>
        </div>

        {/* Past Papers Section - Small */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-1 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Past Papers</h2>
          <button 
            onClick={() => router.push(`/past-papers/${courseId}`)}
            className="w-full py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-200"
          >
            View Past Papers
          </button>
        </div>

        {/* Predicted Papers Section - Medium */}
        <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 col-span-1 sm:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-pink-500">Predicted Papers</h2>
          <button 
            onClick={() => router.push(`/predicted-papers/${courseId}`)}
            className="w-full py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all duration-200"
          >
            View Predicted Papers
          </button>
        </div>

      </div>
    </div>
  );
}
