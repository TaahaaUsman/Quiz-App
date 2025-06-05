// features/courseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching course list
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (_, thunkAPI) => {
    try {
      const cachedCourses = localStorage.getItem("courses");
      const lastFetch = localStorage.getItem("coursesLastFetch");
      const now = new Date().getTime();

      if (
        cachedCourses &&
        lastFetch &&
        now - parseInt(lastFetch) < 24 * 60 * 60 * 1000
      ) {
        return JSON.parse(cachedCourses);
      }

      const response = await fetch("http://localhost:3000/api/courses");
      const data = await response.json();

      if (data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      localStorage.setItem("courses", JSON.stringify(data.data));
      localStorage.setItem("coursesLastFetch", now.toString());

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to load courses");
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    loading: false,
    error: null,
    selectedCategoryId: null, // new
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory } = courseSlice.actions;
export default courseSlice.reducer;
