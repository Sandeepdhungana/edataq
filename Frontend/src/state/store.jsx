import { configureStore } from "@reduxjs/toolkit";
import uploadSliceReducer from "./uploadxml/uploadxmlSlice";

export const store = configureStore({
  reducer: {
    uploadXMLInfo: uploadSliceReducer,
  },
});
