// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { authSliceReducer } from "./slices/authSlice";
import { useDispatch } from "react-redux";
import { orderReducer } from "./slices/orderSlice";
import productReducer from "./slices/productSlice";
import subscribePlansReducer from "./slices/subscribePlansSlice";
import reviewReducer from "./slices/reviewSlice";

import userReducer from "./slices/userSlice";
import reminderReducer from "./slices/reminderSlice";
import categoryReducer from "./slices/categorySlice";
import { userCartReducer } from "./slices/userCartSlice";
import giftDiscountReducer from "./slices/giftDiscountSlice";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    orders: orderReducer,
    product: productReducer,
    subscribePlans: subscribePlansReducer,
    user: userReducer,
    reminder: reminderReducer,
    review: reviewReducer,
    category: categoryReducer,
    userCart: userCartReducer,
    giftDiscount: giftDiscountReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useReduxDispatch = () => useDispatch<AppDispatch>();
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
