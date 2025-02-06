import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { z } from "zod";
import { api } from "../../lib/ajax/api";
import { handleApiError } from "../../lib/utils";
import { validateSchemas } from "../../lib/zod";
const loadFromLocalStorage = (key: string) => {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error(`Error loading data from localStorage: ${error}`);
    return null;
  }
};

const saveToLocalStorage = (key: string, data: { [key: string]: string }) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving data to localStorage: ${error}`);
  }
};

const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from localStorage: ${error}`);
  }
};

const initialState: AuthState = {
  token: loadFromLocalStorage("token"),
  user: loadFromLocalStorage("user"),
  isPending: false,
  isPendingResend: false,
  error: null,
};
type AuthState = {
  token: string | null;
  user: User | null;
  isPending: boolean;
  isPendingResend?: boolean;
  error: string | null;
};

export type CreateUserType = z.infer<typeof validateSchemas.createUser>;
export type LoginFormType = z.infer<typeof validateSchemas.login>;
export type ForgotPasswordType = z.infer<
  typeof validateSchemas.Forgot_Password
>;
export type resendVerifyCodeType = z.infer<
  typeof validateSchemas.ResendVerifyCode
>;
export type CompareVerificationType = z.infer<
  typeof validateSchemas.CompareVerification
>;

export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (values: CreateUserType, { rejectWithValue }) => {
    try {
      const result = await validateSchemas.signup.safeParseAsync(values);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const res = await api.post("/auth/register", {
        ...result.data,
      });
      toast.success(
        "Signed up successfully , Verification code was sent to your email"
      );
      console.log(res, "rrrRegister");

      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: LoginFormType, { rejectWithValue }) => {
    try {
      const result = await validateSchemas.login.safeParseAsync(values);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const res = await api.post("/auth/login", result.data);
      console.log(res, "resresresre");
      toast.success(
        `login successfully ${
          res.data.data?.token ? "" : "sent the verfication code to your email"
        }`
      );
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (values: LoginFormType, { rejectWithValue }) => {
    try {
      console.log(values);
      const result = await validateSchemas.login.safeParseAsync(values);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const res = await api.post("/auth/login_admin", result.data);
      toast.success(
        `login successfully ${
          res.data.data?.token ? "" : "sent the verfication code to your email"
        }`
      );
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);
export const logOutUser = createAsyncThunk(
  "auth/logOutUser",
  async (_values, { rejectWithValue }) => {
    try {
      const res = await api.post("/logout");
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (values: ForgotPasswordType, { rejectWithValue }) => {
    try {
      const result = await validateSchemas.Forgot_Password.safeParseAsync(
        values
      );
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const res = await api.post("/auth/forgot_password", result.data);
      toast.success("your password was sent to your email successfully");
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const compareVeificationCode = createAsyncThunk(
  "auth/compareVeificationCode",
  async (values: CompareVerificationType, { rejectWithValue }) => {
    try {
      const result = await validateSchemas.CompareVerification.safeParseAsync(
        values
      );
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const res = await api.post("/auth/verify_compare", result.data);
      toast.success("your email is confirmed successfully");
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const resendVerifyCode = createAsyncThunk(
  "auth/resendVerifyCode",
  async (values: resendVerifyCodeType, { rejectWithValue }) => {
    try {
      const result = await validateSchemas.ResendVerifyCode.safeParseAsync(
        values
      );
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const res = await api.post("/auth/resend_verify_code", result.data);
      toast.success("your password was sent to your email successfully");
      return res.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(error instanceof Error ? error.message : "Error");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.user = action.payload.data.user;
        saveToLocalStorage("user", action.payload.data.user);
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.token = action.payload.data?.token;
        state.user = action.payload.data.user;
        saveToLocalStorage("token", action.payload.data?.token);
        saveToLocalStorage("user", action.payload.data.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isPending = false;
        state.token = action.payload.data?.token;
        state.user = action.payload.data.user;
        localStorage.setItem("token", action.payload.data?.token);
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(compareVeificationCode.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(compareVeificationCode.fulfilled, (state, action) => {
        state.isPending = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        localStorage.setItem("token", action.payload.data.token);
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
      })
      .addCase(compareVeificationCode.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(resendVerifyCode.pending, (state) => {
        state.isPendingResend = true;
        state.error = null;
      })
      .addCase(resendVerifyCode.fulfilled, (state) => {
        state.isPendingResend = false;
      })
      .addCase(resendVerifyCode.rejected, (state, action) => {
        state.isPendingResend = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(logOutUser.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isPending = false;
        state.token = null;
        state.user = null;
        removeFromLocalStorage("token");
        removeFromLocalStorage("user");
        window.location.reload();
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
  },
});

export const authSliceReducer = authSlice.reducer;
