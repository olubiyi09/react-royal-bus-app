import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartTotalSumAmount: localStorage.getItem("sumAmount")
    ? JSON.parse(localStorage.getItem("sumAmount"))
    : 0,
};

const SumTotalSlice = createSlice({
  name: "sum",
  initialState,
  reducers: {
    CART_SUM_AMOUNT(state, action) {
      //   console.log(action.payload);
      state.cartTotalSumAmount = action.payload;

      localStorage.setItem(
        "sumAmount",
        JSON.stringify(state.cartTotalSumAmount)
      );
    },
  },
});

export const { CART_SUM_AMOUNT } = SumTotalSlice.actions;

export const selectTotalSumAmount = (state) => state.sum.cartTotalSumAmount;

export default SumTotalSlice.reducer;
