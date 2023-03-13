import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingHistory: [],
};

const bookingsSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    STORE_BOOKINGS(state, action) {
      state.bookingHistory = action.payload;
      //   console.log(state.bookingHistory);
    },
  },
});

export const { STORE_BOOKINGS } = bookingsSlice.actions;

export const selectBookingHistory = (state) => state.booking.bookingHistory;

export default bookingsSlice.reducer;
