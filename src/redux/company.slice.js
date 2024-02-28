import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toast: {
    message: '',
    type: 'success'
  },
  toastDuration: 5000
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    toggleToast: (state, action) => {
      state.toast = action.payload;
    },
    updateToastDuration: (state, action) => {
      state.toastDuration = action.payload;
    },
  },
});

export const { toggleToast, updateToastDuration } = companySlice.actions;
export default companySlice.reducer;