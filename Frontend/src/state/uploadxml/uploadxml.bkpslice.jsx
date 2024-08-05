import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getS3SignedUrl = createAsyncThunk(
  "upload/getS3SignedUrl",
  async (file, { rejectWithValue }) => {
    if (!file) return rejectWithValue("No file provided");

    try {
      const response = await axios.get('http://localhost:5000/api/s3-signed-url', {
        params: { file_name: file.name }
      });

      return {
        url: response.data.url,
        file_name: response.data.file_name,
        file: file
      };
    } catch (error) {
      console.error("Error getting signed URL: ", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk for uploading a file using the obtained signed URL
export const uploadFileToS3 = createAsyncThunk(
  "upload/uploadFileToS3",
  async ({ url, file_name, file }, { rejectWithValue }) => {
    try {
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type
        }
      });

      return file_name;
    } catch (error) {
      console.error("Error uploading file to S3: ", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Orchestrator thunk that manages the sequence of the above thunks
export const uploadToS3 = createAsyncThunk(
  "upload/uploadToS3",
  async (file, thunkAPI) => {
    const signedUrlAction = await thunkAPI.dispatch(getS3SignedUrl(file));
    if (signedUrlAction.type.endsWith('fulfilled')) {
      return thunkAPI.dispatch(uploadFileToS3(signedUrlAction.payload));
    }
    return thunkAPI.rejectWithValue(signedUrlAction.payload);
  }
);

// Redux slice for managing upload state
const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    data: null,
    s3FileLocation: null,
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
      .addCase(getS3SignedUrl.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getS3SignedUrl.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(getS3SignedUrl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(uploadFileToS3.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadFileToS3.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.s3FileLocation = action.payload;
      })
      .addCase(uploadFileToS3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, clearData } = uploadSlice.actions;
export default uploadSlice.reducer;
