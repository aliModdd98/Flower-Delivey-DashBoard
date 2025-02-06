import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";
import { validateSchemas } from "../../lib/zod";

export type Order = typeof validateSchemas.createOrder._input & { _id: string };

type OrderStateType = {
  orders: Order[];
  orderPreview?: Order;
  isPending: boolean;
  error: string | null;
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

const initialState: OrderStateType = {
  orders: [],
  isPending: false,
  error: null,
  pagination: {
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 1,
  },
};

// Thunks
export const getAllOrdersThunk = createAsyncThunk(
  "orders/getAll",
  async (values: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders", {
        params: values,
      });
      return res.data; // Assuming the response contains orders in `data`
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);
export const getOrderByIdThunk = createAsyncThunk(
  "orders/getById",
  async (values: { id: string }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders/${values.id}`);
      return res.data; // Assuming the response contains orders in `data`
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const toggleOrderStatusThunk = createAsyncThunk(
  "orders/toggleStatus",
  async (values: { _id: string; status: boolean }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/orders/${values._id}`, values);
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const removeOrderThunk = createAsyncThunk(
  "orders/remove",
  async (_id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/${_id}`);
      return _id;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

// Slice
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(getAllOrdersThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.orders = action.payload.data.orders;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllOrdersThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getOrderByIdThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(getOrderByIdThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.orderPreview = action.payload.data;
      })
      .addCase(getOrderByIdThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(toggleOrderStatusThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(toggleOrderStatusThunk.fulfilled, (state, action) => {
        state.isPending = false;
        const editedOrder = action.payload.data;
        const index = state.orders.findIndex(
          (order) => order._id === editedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = editedOrder;
        }
      })
      .addCase(toggleOrderStatusThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(removeOrderThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(removeOrderThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(removeOrderThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const orderReducer = orderSlice.reducer;
