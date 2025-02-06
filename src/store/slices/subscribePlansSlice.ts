import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";
import { toast } from "react-toastify";
import {
  ResponseDataSubscribePlan,
  SubscribePlan,
} from "../../types/subscribePlansType";

interface SubscribePlanStates {
  subscribePlansData: ResponseDataSubscribePlan;
  loading: boolean;
  loading_delete:boolean;
  error: null | string;
  subscribePlanData: SubscribePlan | null;

}

const initialState: SubscribePlanStates = {
  subscribePlansData: {
    subscribePlans: [],
    pagination: {
      totalPlans: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 1,
    },
  },
  subscribePlanData: null,
  loading: false,
  loading_delete:false,
  error: null,
};

export const getSubscribePlans = createAsyncThunk(
  "subscribe_plans/getSubscribePlans",
  async (queryParams: { page?: number; limit?: number, field?:string, value?:string }, { rejectWithValue }) => {
    try {
      const response = await api.get("/subscribe", {
        params: queryParams,
      });
      if (response.status === 201 || response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const getSubscribePlan = createAsyncThunk(
  "subscribe_plans/getSubscribePlan",
  async (values: { id: string }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/subscribe/${values.id}`);
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const addSubscribePlan = createAsyncThunk(
  "subscribe_plans/addSubscribePlan",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/subscribe", data);
      if (response.status === 201 || response.status === 200) {
        toast.success("Subscribe Plan added successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const deleteSubsciblePlan = createAsyncThunk(
  "subscribe_plans/deleteSubsciblePlan",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/subscribe/${id}`);
      if (response.status === 201 || response.status === 200) {
        toast.success("Subscribe Plan  deleted successfully");
        return response.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const addUserSubscribePlan = createAsyncThunk(
  "subscribe_plans/addUserSubscribePlan",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({data,id_subscibe}:{data:any,id_subscibe:string}, { rejectWithValue }) => {
    try {
      const response = await api.post(`/subscribe/users/${id_subscibe}`, data);
      if (response.status === 201 || response.status === 200) {
        toast.success("User is added successfully to the Plan");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const deleteUserSubsciblePlan = createAsyncThunk(
  "subscribe_plans/deleteUserSubsciblePlan",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/subscribe/users/${id}`);
      if (response.status === 201 || response.status === 200) {
        toast.success("User was deleted successfully from the Plan");
        return response.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

interface updateParameters {
  data: FormData;
  id: string | undefined;
}

export const updateSubscribePlan = createAsyncThunk<
  void,
  updateParameters,
  { rejectValue: string }
>(
  "subscribe_plans/updateSubscribePlan",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/subscribe/${id}`, data);
      if (response.status === 201 || response.status === 200) {
        toast.success("Subscribe Plan updated successfully");
        return response.data;
      }
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

const SubscribePlanSlice = createSlice({
  name: "subscribe_plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubscribePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscribePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribePlanData = action.payload.data;
      })
      .addCase(getSubscribePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getSubscribePlans.pending, (state) => {
        state.loading = true;
        state.error =null;

      })
      .addCase(getSubscribePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribePlansData = action.payload;
      })
      .addCase(getSubscribePlans.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;

      });
      builder
      .addCase(addUserSubscribePlan.pending, (state) => {
        state.loading = true;
        state.error =null;

      })
      .addCase(addUserSubscribePlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUserSubscribePlan.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;

      });
      builder
      .addCase(deleteUserSubsciblePlan.pending, (state) => {
        state.loading_delete = true;
        state.error =null;

      })
      .addCase(deleteUserSubsciblePlan.fulfilled, (state) => {
        state.loading_delete = false;
      })
      .addCase(deleteUserSubsciblePlan.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading_delete = false;

      });
    builder
      .addCase(addSubscribePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSubscribePlan.fulfilled, (state) => {
        state.loading = false;
        // state.subscribePlansData = action.payload;
      })
      .addCase(addSubscribePlan.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateSubscribePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubscribePlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSubscribePlan.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default SubscribePlanSlice.reducer;
