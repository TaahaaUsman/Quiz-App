import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { bg } from '@/assets/Images';
import { FaCalendarCheck, FaSave, FaAngleLeft, FaAngleRight } from "react-icons/fa";

export const HomeSkeleton = () => {
  return (
    <div className="px-6 py-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Welcome back, </h1>
      <div className="overflow-x-auto">
    <table className="w-full table-auto border-collapse border border-gray-200">
      <thead className="bg-blue-500 text-white">
        <tr>
          <th className="border border-white px-4 py-2">Sr No</th>
          <th className="border border-white px-4 py-2">Code</th>
          <th className="border border-white px-4 py-2">Title</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={i}>
            <td className="border border-gray-200 px-4 py-2">
              <Skeleton width={30} />
            </td>
            <td className="border border-gray-200 px-4 py-2">
              <Skeleton width={70} />
            </td>
            <td className="border border-gray-200 px-4 py-2">
              <Skeleton width={200} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  )
}

export const CourseListSkeleton = () => {
    return (
        <div className="w-full pl-8 md:pl-0 pr-2 md:pr-0 md:px-8 lg:px-12 xl:px-20">
        <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="flex space-x-2 justify-end mb-6">
        <input
          type="text"
          placeholder="Search by code or title"
          className="border border-gray-300 rounded px-3 py-1"
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
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
        {[...Array(18)].map((_, i) => (
          <tr key={i}>
            <td className="border border-gray-200 px-4 py-2">
              <Skeleton width={30} />
            </td>
            <td className="border border-gray-200 px-4 py-2">
              <Skeleton width={70} />
            </td>
            <td className="border border-gray-200 px-4 py-2">
              <Skeleton width={200} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
    )
}

export const CourseDetailsSkeleton = () => {
    return (
        <div className="p-6 max-w-6xl mx-auto pl-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="text-center md:text-left w-full">
          <Skeleton height={40} width={250} />
          <span className="text-lg text-gray-600">Course Code:</span>
          <Skeleton height={20} width={150} className="mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className={`
              bg-white p-8 rounded-lg shadow-xl
              ${i === 0 || i === 3 ? 'col-span-2 sm:col-span-1' : 'col-span-1 sm:col-span-1'}
            `}
          >
            <Skeleton height={28} width={180} className="mb-4" />

            {i === 0 ? (
              <div className="flex items-center justify-between gap-4">
                <Skeleton width={90} height={64} />
                <Skeleton height={64} width={90} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Skeleton height={40} />
                {(i === 1 || i === 3) && <Skeleton height={40} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    )
}

export const QuizSkeleton = ({ isMobile }) => {
    
    return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Navbar */}
      <div className="w-full h-[10%] px-2 pr-40 bg-[#212529] text-gray-300 flex justify-between items-center">
        <Skeleton width={200} height={20} />
        <div className="hidden md:flex space-x-8">
          <Skeleton width={100} height={20} />
          <Skeleton width={80} height={20} />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-[80%] flex gap-1">
        {/* Question Panel */}
        <div className="w-full h-full flex flex-col">
          {/* Question area */}
          <div className="bg-cover bg-center h-[45%]" style={{backgroundImage: `url(${bg.src})`}}>
            <div className="flex justify-between items-center py-4 px-4">
              <div>
              <span className='text-white text-base sm:text-lg font-semibold pl-2'>Question No: </span>
              <Skeleton width={100} height={20} />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">
                Marks: <span className="text-[#00c5dc]">1</span> (Time{" "}
                <span className="text-[#00c5dc]">1 Min</span>)
              </p>
            </div>
            <div className="bg-white mx-2 p-2">
              <Skeleton height={150} />
            </div>
            <div className="px-4 py-2">
              <p className="text-white text-base sm:text-lg font-semibold px-2 py-1 md:py-2 xl:py-4">
              Answer
            </p>
            </div>
          </div>

          {/* Options */}
          <div className="p-7 bg-white h-[55%] overflow-y-auto">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="mb-2">
                <Skeleton height={50} />
              </div>
            ))}
          </div>
        </div>

        {/* Summary panel placeholder (non-mobile only) */}
        {!isMobile && (
          <div className="relative h-full w-64 bg-gray-100 hidden md:block">
            <div
                    className="bg-cover bg-center h-auto p-3 pb-4"
                    style={{ backgroundImage: `url(${bg.src})` }}
                  >
                    <p className="text-white text-lg font-semibold">Summary</p>
                  </div>
            <div className="p-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton key={index} width={24} height={24} className="rounded-full" />
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 w-full p-4 bg-white">
              <Skeleton width={100} height={20} />
              <Skeleton className="mt-2" height={8} width="100%" />
              <Skeleton className="mt-1" width={60} height={14} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={`w-full ${isMobile ? "h-[15%]" : "h-[10%]"} bg-gray-200`}>
        <div className="h-full flex flex-col md:flex-row justify-between items-center px-4 py-2">
          {/* Left side buttons */}
          <div className="flex flex-row gap-2 w-full md:w-auto">
            <button
                            className={`bg-red-700 text-black px-2 cursor-pointer sm:px-4 py-1 sm:py-3 rounded-md flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition w-full md:w-auto`}
                          >
                            <FaCalendarCheck style={{ fontSize: '1rem', color: 'black' }} />
                            <span className="text-sm sm:text-base">Finish Practice</span>
                          </button>
            <button
                href="/"
                className="bg-[#34bfa3cd] text-black px-4 py-3 rounded-md flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition w-full md:w-auto"
              >
                Back to Courses
              </button>
          </div>

          {/* Right side buttons */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
            <div className="flex gap-2">
              <button
                                className="bg-[#c19026d5] text-black py-2 w-1/2 md:w-24 rounded-l-md border-r border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                              >
                                <FaAngleLeft style={{ fontSize: '1rem', color: 'black' }} />
                                <span>First</span>
                              </button>
              <button
                                className="bg-[#c19028d5] text-black py-2 w-1/2 md:w-24 rounded-r-md border-l border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                              >
                                <span>Last</span>
                                <FaAngleRight style={{ fontSize: '1rem', color: 'black' }} />
                              </button>
              <button
                              className={`bg-[#34bfa3cd]  w-1/2 rounded-md text-white px-4 py-2 flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition`}
                            >
                              <FaSave style={{ fontSize: '1rem', color: 'white' }} />
                              <span>Save</span>
                            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ContactUsSkeleton = () => {
    return (
        <div className="w-full flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md space-y-5">
        {/* Heading */}
        <Skeleton height={30} width="60%" />

        {/* Upload field */}
        <div>
          <Skeleton height={20} width="40%" />
          <Skeleton height={40} />
        </div>

        {/* Description field */}
        <div>
          <Skeleton height={20} width="50%" />
          <Skeleton height={100} />
        </div>

        {/* Submit button */}
        <Skeleton height={44} />
      </div>
    </div>
    )
}
