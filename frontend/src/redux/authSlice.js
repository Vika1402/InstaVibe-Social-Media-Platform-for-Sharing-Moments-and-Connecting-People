import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    //multiplae actions we make in reducers
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUser: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUser,
  setUserProfile,
  setSelectedUser,
} = authSlice.actions;
export default authSlice.reducer;
