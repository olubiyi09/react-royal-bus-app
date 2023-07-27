import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  userFullList: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    STORE_USERNAMES(state, action) {
      state.userList = action.payload;
    },
    STORE_FULL_USERNAMES(state, action) {
      state.userFullList = action.payload;
    },
  },
});

export const { STORE_USERNAMES, STORE_FULL_USERNAMES } = usersSlice.actions;

export const selectUserList = (state) => state.users.userList;
export const selectUserFullList = (state) => state.users.userFullList;
export default usersSlice.reducer;
