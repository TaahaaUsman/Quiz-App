import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/CounterSlice";
import coursesReducer from "./Slices/CoursesSlice";
import categoryReducer from "./Slices/categorySlice";
import quizReducer from "./Slices/quizSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    courses: coursesReducer,
    category: categoryReducer,
    quiz: quizReducer,
  },
});
