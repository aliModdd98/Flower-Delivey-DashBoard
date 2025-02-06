import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";
import { toast } from "react-toastify";

interface Reminder {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null | unknown | undefined;
}

const initialState: ReminderState = {
  reminders: [],
  loading: false,
  error: null,
};

export const getReminders = createAsyncThunk(
  "reminder/getReminders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reminder");
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const sendReminder = createAsyncThunk(
  "reminder/sendReminder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/reminder/send-email", data);
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const addReminder = createAsyncThunk(
  "reminder/addReminder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/reminder", "");
      if (response.status === 200) {
        toast.success("You Are Now subscribed to the Reminder Service");
        return;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);
export const removeReminder = createAsyncThunk(
  "reminder/removeReminder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/reminder");
      if (response.status === 200) {
        toast.success("You Are Not subscribed in Reminder Service");
        return;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

const ReminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(getReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendReminder.fulfilled, (state) => {
        state.loading = false;

        toast.success("send successfully");
      })
      .addCase(sendReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReminder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReminder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ReminderSlice.reducer;
