import { createSlice } from "@reduxjs/toolkit";

const initialState = { userDetails: {}, signupForm: {
  username: "",
  email: "",
  mobile: "",
}, passwordRecoveryForm: {
  email: ''
}, unsubscribedUserHistory: [] };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signupFormData: (state, action) => {
      state.signupForm = action.payload;
    },
    passwordRecoveryFormData: (state, action) => {
      state.passwordRecoveryForm = action.payload;
    },
    setUserSubscribedHistory: (state, action) => {
      state.unsubscribedUserHistory = action.payload.response;
    },
  },
});

export const { signupFormData, passwordRecoveryFormData, setUserSubscribedHistory } = userSlice.actions;
export default userSlice.reducer;