import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔁 Thunk to fetch categories with caching
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const cachedCategories = localStorage.getItem("categories");
      const lastFetch = localStorage.getItem("categoriesLastFetch");
      const now = new Date().getTime();

      if (
        cachedCategories &&
        lastFetch &&
        now - parseInt(lastFetch) < 24 * 60 * 60 * 1000
      ) {
        return JSON.parse(cachedCategories);
      }

      const response = await fetch("http://localhost:3000/api/temp/category");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();

      localStorage.setItem("categories", JSON.stringify(data));
      localStorage.setItem("categoriesLastFetch", now.toString());

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
