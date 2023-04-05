import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mergedSeat: localStorage.getItem("mergedSeats")
    ? JSON.parse(localStorage.getItem("mergedSeats"))
    : [],
};

const mergedSeatSlice = createSlice({
  name: "mSeats",
  initialState,
  reducers: {
    STORE_MERGED_SEAT(state, action) {
      //   console.log(action.payload);
      state.mergedSeat = action.payload;

      localStorage.setItem("mergedSeats", JSON.stringify(state.mergedSeat));
    },
  },
});

export const { STORE_MERGED_SEAT } = mergedSeatSlice.actions;

export const selectMergedSeats = (state) => state.mSeats.mergedSeat;

export default mergedSeatSlice.reducer;
