"use client";
import React, { useState, useEffect } from "react";
import { bg } from "../assets/Images";
import {
  FaExclamation,
  FaCalendarCheck,
  FaSave,
  FaAngleLeft,
  FaAngleRight,
  FaUser,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { MdQuiz } from "react-icons/md";
import useIsMobile from "@/utils/useIsMobile";
import { useAuth } from "./UserProvider";

const QuizPage = ({ quiz, courseDetails, courseId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null); // Can be 'correct', 'incorrect', or null
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [course, setCourse] = useState(courseDetails);
  const [showSummary, setShowSummary] = useState(true);
  const [answers, setAnswers] = useState([]);
  const isMobile = useIsMobile();
  const user = useAuth();

  useEffect(() => {
    if (quiz?.length > 0) {
      setQuestions(quiz);
    }
  }, []);

  useEffect(() => {
    if (questions?.length) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  const handleOptionChange = (index) => {
    setSelectedOption(index);
    setSubmissionStatus(null);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    if (selectedOption !== questions[currentIndex].correctOptionIndex) {
      setSubmissionStatus("incorrect");
    } else {
      setSubmissionStatus("correct"); // You can still use this if you want immediate feedback for correct answers
      setScore((prev) => prev + 1);
    }
    // We don't immediately reveal the correct answer if the selected one is wrong.
  };

  const handleNext = () => {
    // 1️⃣ copy the old answers
    const newAnswers = [...answers];

    // 2️⃣ write the current selection into that array slot
    newAnswers[currentIndex] = selectedOption;

    // 3️⃣ update state
    setAnswers(newAnswers);

    // 4️⃣ move forward (or finish)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setSubmissionStatus(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmissionStatus(null);
    setScore(0);
    setShowResult(false);
  };

  const handleSubmitBackend = async () => {
    try {
      const response = await fetch("/api/quiz/answerSubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          type,
          attemptedAnswers: answers,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log("Pata nahi kaya howa ha");
        return;
      }

      if (!data) {
        console.log("Some data issue");
        return;
      }

      console.log(data);
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  if (questions?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white text-gray-700 px-4">
        <div className="text-blue-500 mb-6">
          <MdQuiz size={100} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center">
          No Questions Available
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
          It looks like this course doesn't have any{" "}
          <span className="text-blue-500 underline"></span> MCQs or questions
          added yet. Please check back later or explore other available courses.
        </p>
        <Link
          href={`/courses/${courseId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 shadow-md"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (showResult) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-lg mb-4">
          Your Score: {score} / {questions.length}
        </p>
        <button
          onClick={handleRestart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Restart
        </button>
      </div>
    );
  }

  // Navbar logic
  const date = new Date();
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  // Navigation Logic
  const handleFirst = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmissionStatus(null);
  };

  const handleLast = () => {
    setCurrentIndex(questions.length - 1);
    setSelectedOption(null);
    setSubmissionStatus(null);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setSubmissionStatus(null);
    }
  };

  // Summary logic

  const totalQuestions = questions.length;
  const attempted = answers.filter((ans) => ans !== null).length;
  const progressPercentage = (attempted / totalQuestions) * 100;

  const handleSwitchQuestion = (idx) => {
    setCurrentIndex(idx);
    setSelectedOption(answers[idx]);
    setSubmissionStatus(null);
  };

  const handleFinishPractice = () => {
    setShowSummary(true);
  };

  return (
    <div className="h-screen m-0 p-0 bg-gray-200">
      {/* User button */}
      <div className="hidden absolute h-28 w-24 top-2 right-4 sm:right-10 z-10 bg-gray-500 rounded-full md:flex items-center justify-center cursor-pointer overflow-hidden">
        <Image
          src={user.profilePictureUrl}
          alt="User"
          width={140}
          height={100}
          className="object-cover w-full h-full"
          unoptimized
        />
      </div>

      {/* Navbar */}
      <nav className="w-full h-[10%] px-2 pr-40 bg-[#212529] text-white font-semibold mb-2 flex justify-between items-center">
        <span className="text-sm sm:text-base">
          <Link href={`/courses/${courseId}`}>
            {course.code} (
            <span className="underline hover:text-blue-500">
              {course.title}
            </span>
            )
          </Link>
        </span>

        <div className="hidden md:block">
          <div className="flex space-x-8">
            <span>Login Time {formatTime(date)}</span>
            <span>Guest</span>
          </div>
        </div>
      </nav>

      {/* Questions/Answer section + Summary */}
      <div className="w-full h-[75%] md:h-[78%] flex gap-1 flex-col md:flex-row">
        <div
          className={`w-full h-full ${
            showSummary ? "w-[83%]" : "w-full"
          } flex flex-col`}
        >
          <div
            className="h-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg.src})` }}
          >
            <div className="h-full bg-purple-700/40">
              <div className="h-[20%] flex justify-between items-center py-1 md:py-2 xl:py-4 pr-2 sm:pr-20 md:pr-36">
                <p className="text-white text-base sm:text-lg font-semibold pl-2">
                  Question No : {currentIndex + 1} of {questions.length}
                </p>

                <div className="flex items-center space-x-2 font-semibold">
                  <p className="text-xs sm:text-sm text-white">
                    Marks: <span className="text-[#00c5dc]">1</span> (Time{" "}
                    <span className="text-[#00c5dc]">1 Min</span>)
                  </p>
                  <div className="hidden md:block">
                    <span className="cursor-pointer w-10 h-10 bg-[#ffb822] rounded-full flex items-center justify-center">
                      <FaExclamation
                        style={{ fontSize: "1.4rem", color: "white" }}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[60%] bg-white p-1 w-full shadow-md">
                <textarea
                  className="font-bold w-full h-full outline-none border-2 border-gray-200 p-2"
                  readOnly
                  value={currentQuestion?.questionText}
                />
              </div>

              <div>
                <p className="h-[20%] text-white text-base sm:text-lg font-semibold px-2 py-1 md:py-2 xl:py-4">
                  Answer
                </p>
              </div>
            </div>
          </div>

          <div className="h-1/2 p-7 lg:py-7 xl:py-8 bg-white text-[17px] shadow-md overflow-y-auto">
            {currentQuestion?.options?.map((option, index) => {
              let bgColor = "";

              if (submissionStatus === "incorrect") {
                if (index === selectedOption) {
                  bgColor = "bg-red-300";
                }
                // We no longer explicitly highlight the correct answer here
              } else if (submissionStatus === "correct") {
                if (index === selectedOption) {
                  bgColor = "bg-green-300"; // Keep this if you provide immediate green for correct answers
                }
              } else if (index === selectedOption) {
                bgColor = "bg-blue-300";
              }

              return (
                <div
                  key={index}
                  onClick={() => handleOptionChange(index)}
                  className={`p-2 lg:py-3 xl:py-4 border border-gray-200 rounded-md mb-2 cursor-pointer ${bgColor}`}
                >
                  {option}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`hidden md:block h-full`}>
          {/* ToggleSummary button */}
          <div className="absolute right-0 top-80 z-10">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="bg-purple-700/80 text-white px-4 py-4 rounded-l-md flex items-center gap-1 cursor-pointer"
            >
              {showSummary ? (
                <FaAngleDoubleRight
                  style={{ fontSize: "1rem", color: "white" }}
                />
              ) : (
                <FaAngleDoubleLeft
                  style={{ fontSize: "1rem", color: "white" }}
                />
              )}
            </button>
          </div>

          {/* Summary content */}
          <div
            className={`relative h-full bg-gray-100 ${
              showSummary ? "block" : "hidden"
            }`}
          >
            {/* Header */}
            <div
              className="bg-cover bg-center h-auto p-3 pb-4"
              style={{ backgroundImage: `url(${bg.src})` }}
            >
              <p className="text-white text-lg font-semibold">Summary</p>
            </div>

            {/* Question status grid */}
            <div
              className="p-2"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <div className="grid grid-cols-6 gap-4">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleSwitchQuestion(index)}
                    className={`cursor-pointer w-6 h-6 rounded-xl flex items-center justify-center text-sm font-semibold ${
                      answers[index] !== null
                        ? answers[index] === questions[index].correctOptionIndex
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary footer */}
            <div className="absolute bottom-0 w-full p-4 bg-white">
              <div className="flex items-center justify-between">
                <span>Attempted: {attempted}</span>
                <span>Total: {totalQuestions}</span>
              </div>
              <div className="mt-2">
                <progress
                  className="w-full"
                  value={attempted}
                  max={totalQuestions}
                ></progress>
                <div className="text-center mt-1">
                  {progressPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {isMobile ? (
        <div className={`h-[13%] text-sm`}>
          <div className="w-full h-full bg-gray-200">
            {/* Buttons container for mobile screen */}
            <div className="h-full flex flex-col justify-evenly items-center px-4">
              {/* First container */}
              <div className="flex flex-row w-full">
                <button
                  onClick={handlePrevious}
                  className="bg-[#c19026d5] text-black py-2 w-1/2 rounded-l-md border-r border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                >
                  <FaAngleLeft style={{ fontSize: "1rem", color: "black" }} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  className={`bg-[#c19028d5] border-l rounded-r-md text-black py-2 w-1/2 md:w-24 border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition`}
                >
                  <span>Next</span>
                  <FaAngleRight style={{ fontSize: "1rem", color: "black" }} />
                </button>
              </div>

              {/* Second container */}
              <div className="flex flex-row w-full">
                <Link
                  href="/"
                  className="bg-red-700 border-r w-1/2 text-black px-4 py-3 rounded-l-md flex items-center justify-center hover:bg-opacity-80 active:scale-95 transition"
                >
                  Back to Courses
                </Link>
                <button
                  onClick={handleSubmit}
                  className={`bg-[#34bfa3cd] border-l font-semibold w-1/2 border-black rounded-r-md text-white px-4 py-2 flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition`}
                >
                  <FaSave style={{ fontSize: "1rem", color: "white" }} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`h-[13%] md:h-[10%] text-sm`}>
          <div className="w-full h-full px-2 bg-gray-200">
            <div className="h-full flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
              <div className="flex flex-row gap-2 sm:gap-4 w-full md:w-auto">
                <button
                  onClick={handleFinishPractice}
                  className="bg-red-700 text-black cursor-pointer px-4 py-3 rounded-md flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition w-auto"
                >
                  <FaCalendarCheck
                    style={{ fontSize: "1rem", color: "black" }}
                  />
                  <span className="text-base">Finish Practice</span>
                </button>

                <Link
                  href="/"
                  className="bg-[#34bfa3cd] text-black px-4 py-3 rounded-md flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition w-auto"
                >
                  Back to Courses
                </Link>
              </div>

              <div className="mt-0 flex flex-row gap-4 w-auto">
                <div>
                  <div className="flex w-full md:w-auto">
                    <button
                      onClick={handleFirst}
                      className="bg-[#c19026d5] text-black py-3 w-24 rounded-l-md border-r border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                    >
                      <FaAngleLeft
                        style={{ fontSize: "1rem", color: "black" }}
                      />
                      <span>First</span>
                    </button>
                    <button
                      onClick={handleLast}
                      className="bg-[#c19028d5] text-black py-3 w-24 rounded-r-md border-l border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                    >
                      <span>Last</span>
                      <FaAngleRight
                        style={{ fontSize: "1rem", color: "black" }}
                      />
                    </button>
                  </div>
                </div>

                {isMobile ? (
                  <div className="flex">
                    <button
                      onClick={handleNext}
                      className="bg-[#c19028d5] border-r rounded-l-md text-black py-2 w-24 border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                    >
                      <span>Next</span>
                      <FaAngleRight
                        style={{ fontSize: "1rem", color: "black" }}
                      />
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="bg-[#34bfa3cd] border-l w-1/2 border-black rounded-r-md text-white px-4 py-2 flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                    >
                      <FaSave style={{ fontSize: "1rem", color: "white" }} />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex w-auto">
                      <div>
                        <button
                          onClick={handlePrevious}
                          className="bg-[#c19026d5] text-black py-3 w-24 rounded-l-md border-r border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                        >
                          <FaAngleLeft
                            style={{ fontSize: "1rem", color: "black" }}
                          />
                          <span>Previous</span>
                        </button>
                      </div>

                      <button
                        onClick={handleNext}
                        className="bg-[#c19028d5] border-l rounded-r-md text-black py-3 w-24 border-black flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                      >
                        <span>Next</span>
                        <FaAngleRight
                          style={{ fontSize: "1rem", color: "black" }}
                        />
                      </button>

                      {/* Save Button - Full Width on Small Screens */}
                      <button
                        onClick={handleSubmit}
                        className="bg-[#34bfa3cd] rounded-md ml-4 text-white px-4 py-3 flex items-center justify-center gap-1 hover:bg-opacity-80 active:scale-95 transition"
                      >
                        <FaSave style={{ fontSize: "1rem", color: "white" }} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
