import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSeats: [],
  bookedSeats: localStorage.getItem("bookedSeats")
    ? JSON.parse(localStorage.getItem("bookedSeats"))
    : [],
};

const seatSlice = createSlice({
  name: "seats",
  initialState,
  reducers: {
    STORE_SELECTED_SEATS(state, action) {
      state.selectedSeats = action.payload.seats;
      //   console.log(action.payload);
    },

    STORE_BOOKED_SEATS(state, action) {
      state.bookedSeats = action.payload;
      console.log(action.payload);
      localStorage.setItem("bookedSeats", JSON.stringify(state.bookedSeats));
    },
  },
});

export const { STORE_SELECTED_SEATS, STORE_BOOKED_SEATS } = seatSlice.actions;

export const selectSelectedSeats = (state) => state.seats.selectedSeats;
export const selectBookedSeats = (state) => state.seats.bookedSeats;

export default seatSlice.reducer;
