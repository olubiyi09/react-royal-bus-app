import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import userListReducer from "./slice/usersSlice";
import busReducer from "./slice/busSlice";
import cartReducer from "./slice/cartSlice";
import bookingReducer from "./slice/bookingsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  bus: busReducer,
  cart: cartReducer,
  booking: bookingReducer,
  users: userListReducer,
});

const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
