import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartStateType = {
  carts: Cart[];
};

const initialState: CartStateType = {
  carts: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    create: (
      state,
      action: PayloadAction<Omit<Omit<Cart, "_id">, "createdAt">>
    ) => {
      const newCart: Cart = {
        _id: crypto.randomUUID(),
        //@ts-expect-error date type conflict
        createdAt: `${new Date()}`,
        ...action.payload,
      };
      state.carts.push(newCart);
      console.log("Cart created:", newCart);
    },

    update: (
      state,
      action: PayloadAction<{ _id: string; data: Partial<Cart> }>
    ) => {
      const { _id, data } = action.payload;
      const index = state.carts.findIndex((cart) => cart._id === _id);
      if (index !== -1) {
        state.carts[index] = {
          ...state.carts[index],
          ...data,
        };
        console.log("Cart updated:", state.carts[index]);
      }
    },

    delete: (state, action: PayloadAction<string>) => {
      state.carts = state.carts.filter((cart) => cart._id !== action.payload);
      console.log("Cart deleted with ID:", action.payload);
    },
  },
});

export const {
  create: createCart,
  update: updateCart,
  delete: removeCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
