import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice";
import companySlice from "./company.slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    company: companySlice
  },
});

export default store;