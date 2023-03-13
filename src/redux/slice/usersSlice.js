import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    STORE_USERNAMES(state, action) {
      state.userList = action.payload;
    },
  },
});

export const { STORE_USERNAMES } = usersSlice.actions;

export const selectUserList = (state) => state.users.userList;
export default usersSlice.reducer;
