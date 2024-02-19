import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice";
import companySlice from "./company.slice";
import masterSlice from "./master.slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    company: companySlice,
    master: masterSlice
  },
});

export default store;