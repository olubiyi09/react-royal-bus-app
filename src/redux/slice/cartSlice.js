import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalAmount: localStorage.getItem("cartAmount")
    ? JSON.parse(localStorage.getItem("cartAmount"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART(state, action) {
      // console.log(action.payload);

      state.cartItems = action.payload;
      state.cartTotalAmount = action.payload.price;

      // //   save cart to local storage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("cartAmount", JSON.stringify(state.cartItems.price));
    },

    CART_AMOUNT(state, action) {
      const totalCartPrice = localStorage.getItem("cartAmount");

      state.cartTotalAmount = totalCartPrice;
      // console.log(localStorage.getItem(totalCartPrice));
    },

    REMOVE_FROM_CART(state, action) {
      //   console.log(action.payload);

      state.cartItems = action.payload;
      state.cartTotalAmount = action.payload.price;

      localStorage.clear();
    },
  },
});

export const { ADD_TO_CART, REMOVE_FROM_CART, CART_AMOUNT } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalAmount = (state) => state.cart.cartTotalAmount;

export default cartSlice.reducer;
