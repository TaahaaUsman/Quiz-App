// features/quiz/quizSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching quiz data
export const fetchQuiz = createAsyncThunk(
  "quiz/fetchQuiz",
  async ({ courseId, type }, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3000/api/quiz/getQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, type }),
      });

      const data = await response.json();
      return data.questions; // returns the questions array
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch quiz data");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questionsDetails: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quizSlice.reducer;
