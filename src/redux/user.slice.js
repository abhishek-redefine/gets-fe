import { createSlice } from "@reduxjs/toolkit";

const initialState = { userDetails: {}, signupForm: {
  username: "",
  email: "",
  mobile: "",
}, passwordRecoveryForm: {
  email: ''
}, unsubscribedUserHistory: [],
allUserPermissions: {} };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAllUserPermissions: (state, action) => {
      state.allUserPermissions = action.payload.response;
    }
  },
});

export const { setAllUserPermissions } = userSlice.actions;
export default userSlice.reducer;