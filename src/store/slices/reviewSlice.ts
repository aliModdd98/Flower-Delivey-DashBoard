import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";
import { parseErrorMessage } from "../../utils/helper";

export type TReviewFromBackEnd = {
  _id: "string";
  name: "string";
  text: "string";
  createdAt: "string";
  updatedAt: "string";
  __v: "number";
};

type TInitialState = {
  reviews: TReviewFromBackEnd[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalReviews: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

const initialState: TInitialState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    totalReviews: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 1,
  },
};

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (
    queryParams: {
      page?: number;
      limit?: number;
      field?: string;
      value?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(`/review`, {
        params: queryParams,
      });

      return response.data.data;
    } catch (error) {
      handleApiError(error);
      const generalMessage = "Failed to get reviews";
      return rejectWithValue(parseErrorMessage(error, generalMessage));
    }
  }
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async (
    values: { name: string; text: string; shouldShow: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/review`, values);

      return response.data.data;
    } catch (error) {
      handleApiError(error);
      const generalMessage = "failed to add review";
      return rejectWithValue(parseErrorMessage(error, generalMessage));
    }
  }
);

export const editReview = createAsyncThunk(
  "review/editReview", // Corrected action type
  async (
    {
      id,
      reviewInfo,
    }: {
      id: string;
      reviewInfo: { name: string; text: string; shouldShow: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/review/${id}`, reviewInfo);

      return response.data.data;
    } catch (error) {
      handleApiError(error);
      const generalMessage = "failed to edit review";
      return rejectWithValue(parseErrorMessage(error, generalMessage));
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/review/${id}`);
      return id;
    } catch (error) {
      handleApiError(error);
      const generalMessage = "failed to delete review";
      return rejectWithValue(parseErrorMessage(error, generalMessage));
    }
  }
);

// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getReviews
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;

        console.log("hi hero5", action.payload);
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );

        // Update the pagination state
        const totalReviews = state.pagination.totalReviews - 1; // Decrement total users
        const totalPages = Math.max(
          1,
          Math.ceil(totalReviews / state.pagination.pageSize)
        ); // Recalculate total pages

        // Adjust current page if necessary
        if (state.pagination.currentPage > totalPages) {
          state.pagination.currentPage = totalPages; // If current page is greater than the new total pages, set it to the last page
        }

        // Update pagination state
        state.pagination = {
          ...state.pagination,
          totalReviews,
          totalPages,
        };

        toast.success("review deleted successfully");
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle addReview
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);

        toast.success("review added successfully");
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle editReview (with corrected action type)
      .addCase(editReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }

        toast.success("review updated successfully");
      })
      .addCase(editReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

const reviewReducer = reviewSlice.reducer;
export default reviewReducer;
