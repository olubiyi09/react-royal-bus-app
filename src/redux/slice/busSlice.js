import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buses: [],
};

const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    STORE_BUSES: (state, action) => {
      state.buses = action.payload.buses;
      //   console.log(state.buses);
    },
  },
});

export const { STORE_BUSES } = busSlice.actions;

export const selectBuses = (state) => state.bus.buses;

export default busSlice.reducer;
