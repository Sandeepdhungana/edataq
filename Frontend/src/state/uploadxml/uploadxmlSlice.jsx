import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { socket } from "../../socket";

export const uploadToS3 = createAsyncThunk(
  "upload/uploadToS3",
  async (file, { rejectWithValue }) => {
    if (!file) return;

    try {
      const response = await axios.get(
        "http://localhost:5000/api/s3-signed-url",
        {
          params: { file_name: file.name },
        }
      );

      const { url, file_name } = response.data;

      // now upload the file to s3
      const uploading = await axios.put(url, file, {
        headers: {
          "Content-Type": "",
        },
      });

      console.log(uploading);

      if (uploading) {
        // now emit the socket to process the file with file name
        socket.emit("start_processing", { file: file_name });
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
      return rejectWithValue(error.message);
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadToS3.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadToS3.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(uploadToS3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, clearData } = uploadSlice.actions;

export default uploadSlice.reducer;
