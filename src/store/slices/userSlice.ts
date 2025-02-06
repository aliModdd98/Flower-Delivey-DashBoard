import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { z } from "zod";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";
import { validateSchemas } from "../../lib/zod";
import { parseErrorMessage } from "../../utils/helper";

export type TUserFromBackend = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isReminder: boolean;
  subscribe_id: string;
};

// Define types
type TUserUpdate = Partial<z.infer<typeof validateSchemas.editUser>>;

type TInitialState = {
  users: TUserFromBackend[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

const initialState: TInitialState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 1,
  },
};

// Async thunks
const getUsers = createAsyncThunk(
  "user/getUsers",
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
      const response = await api.get(`/users`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      const message = parseErrorMessage(error, "Failed to fetch users");
      return rejectWithValue(message);
    }
  }
);

const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      handleApiError(error);
      const message = parseErrorMessage(error, "Failed to delete user");
      return rejectWithValue(message);
    }
  }
);

const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/register`, userData);
      return response.data.data.user;
    } catch (error) {
      handleApiError(error);
      const message = parseErrorMessage(error, "Failed to add user");
      return rejectWithValue(message);
    }
  }
);

const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    values: { userId: string; userData: TUserUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/users/${values.userId}`,
        values.userData
      );
      return response.data.data.user;
    } catch (error) {
      handleApiError(error);
      const message = parseErrorMessage(error, "Failed to update user");
      return rejectWithValue(message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getUsers
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);

        toast.success("User deleted successfully");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle addUser
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);

        toast.success("User added successfully");
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }

        toast.success("User updated successfully");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exports
export { addUser, deleteUser, getUsers, updateUser };
export default userSlice.reducer;
