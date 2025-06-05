import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import db from "../app/(Backend)/database/lib/db.js"; // ✅ connect to DB
import Course from "../app/(Backend)/database/models/coursesModel/coursesModel.js"; // ✅ your Course model
import Quiz from "../app/(Backend)/database/models/quizModel/quizModel.js"; // ✅ your Quiz model
import dotenv from "dotenv";
dotenv.config();

const dataPath = path.join(process.cwd(), "data"); // ✅ target folder

const readJSON = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.log(`❌ Error reading ${filePath}`);
    return null;
  }
};

const convertQuestions = (arr) => {
  return arr.map((q, index) => ({
    index: index + 1,
    questionText: q.text,
    options: q.options,
    correctOptionIndex: q.correct - 1,
  }));
};

const run = async () => {
  await db();
  console.log("✅ DB Connected");

  const folders = fs.readdirSync(dataPath);

  for (const folderName of folders) {
    const folderPath = path.join(dataPath, folderName);

    // Check if it's a folder
    if (!fs.lstatSync(folderPath).isDirectory()) continue;

    // Find course by code
    const course = await Course.findOne({ code: folderName });
    if (!course) {
      console.log(`⚠️ Course not found for code: ${folderName}`);
      continue;
    }

    // Check for mid.json
    const midPath = path.join(folderPath, "mid.json");
    if (fs.existsSync(midPath)) {
      const midData = readJSON(midPath);
      if (midData) {
        await Quiz.create({
          courseId: course._id,
          type: "midterm",
          questions: convertQuestions(midData),
        });
        console.log(`✅ Inserted midterm quiz for ${folderName}`);
      }
    }

    // Check for final.json
    const finalPath = path.join(folderPath, "final.json");
    if (fs.existsSync(finalPath)) {
      const finalData = readJSON(finalPath);
      if (finalData) {
        await Quiz.create({
          courseId: course._id,
          type: "finalterm",
          questions: convertQuestions(finalData),
        });
        console.log(`✅ Inserted finalterm quiz for ${folderName}`);
      }
    }
  }

  console.log("🎉 All quizzes inserted!");
  mongoose.disconnect();
};

run();
