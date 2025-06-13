import { QuizPage } from "@/components";

const getQuizDetails = async (type, courseId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/getQuiz`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, courseId }),
        cache: "no-store",
      }
    );

    const data = await res.json();
    const actualData = data.questions;
    const courseDetails = data.courseDetails;

    return { actualData, courseDetails };
  } catch (err) {
    console.error("Server fetch error:", err);
    return { actualData: null, courseDetails: null };
  }
};

const page = async ({ params }) => {
  const { type, courseId } = await params;

  const { actualData, courseDetails } = await getQuizDetails(type, courseId);

  return (
    <QuizPage
      quiz={actualData}
      courseDetails={courseDetails}
      courseId={courseId}
    />
  );
};

export default page;
