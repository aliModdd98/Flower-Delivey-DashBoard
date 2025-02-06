import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";

// Type definitions
type CartType = {
  hasDiscount: boolean;
  totalAmount: number;
  product_array: ProductType[];
  user_id: string;
};

type ProductType = {
  priceAfterDiscount: string;
  discount: string | undefined;
  quantity: string;
  title: string;
  image: string;
  stock: string;
  price: string;
  description: string;
  accessory_id: AccessoryType[];
};

type AccessoryType = {
  title: string;
  image: string;
  stock: number;
  description: string;
  price: number;
};

type CartStateType = {
  cart: CartType | null;
  isPending: boolean;
  error: string | null;
};

const initialState: CartStateType = {
  cart: null,
  isPending: false,
  error: null,
};

// Thunks
export const getCartThunk = createAsyncThunk(
  "cart/get",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/cart/${userId}`);
      return res.data; // Assuming the response contains cart data
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (
    values: { userId: string; product: ProductType },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/cart/${values.userId}/add`, values.product);
      return res.data; // Assuming the response contains updated cart data
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/remove",
  async (
    values: { userId: string; productId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.delete(
        `/cart/${values.userId}/remove/${values.productId}`
      );
      return res.data; // Assuming the response contains updated cart data
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clear",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/cart/${userId}/clear`);
      return res.data; // Assuming the response confirms cart clearance
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

// Slice
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.cart = action.payload;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.cart = action.payload;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(removeFromCartThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(clearCartThunk.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.isPending = false;
        state.cart = null;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
  },
});

// Export reducer
export const userCartReducer = cartSlice.reducer;
