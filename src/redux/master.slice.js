import { MASTER_DATA_TYPES } from "@/constants/app.constants.";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  [MASTER_DATA_TYPES.NODAL_POINT]: [],
  [MASTER_DATA_TYPES.USER_TYPE]: [],
  [MASTER_DATA_TYPES.SHIFT_TYPE]: [],
  [MASTER_DATA_TYPES.WEEKDAY]: [],
  [MASTER_DATA_TYPES.TRANSPORT_TYPE]: [],
  [MASTER_DATA_TYPES.SHIFT_TYPE]: [],
  [MASTER_DATA_TYPES.ROUTE_TYPE]: [],
  [MASTER_DATA_TYPES.GENDER]: []
};

const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    setMasterData: (state, action) => {
      state[action.payload.type] = action.payload.data;
    }
  },
});

export const { setMasterData } = masterSlice.actions;
export default masterSlice.reducer;