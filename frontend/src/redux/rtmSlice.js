import { createSlice } from "@reduxjs/toolkit";

const rtmSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [], // e.g., [{userId: 1, type: "like"}]
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const { type, userId } = action.payload;

      if (type === "like") {
        // Avoid adding duplicate notifications
        const exists = state.likeNotification.some((item) => item.userId === userId);
        if (!exists) {
          state.likeNotification.push(action.payload);
        }
      } else if (type === "dislike") {
        // Filter out the disliked notification
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== userId
        );
      }
    },
  },
});

export const { setLikeNotification } = rtmSlice.actions;
export default rtmSlice.reducer;
