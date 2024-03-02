import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

type PartsOfSpeech = {
  id: number;
  ja_name: string;
  en_name: string;
}[];

export interface PartsOfSpeechState {
  partsOfSpeech: PartsOfSpeech;
  isLoading: boolean;
}

const initialState: PartsOfSpeechState = {
  partsOfSpeech: [],
  isLoading: true,
};

const partsOfSpeech = createSlice({
  name: "parts_of_speech",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncPartOfSpeech.fulfilled, (state, { payload }) => {
      state.partsOfSpeech = payload;
      state.isLoading = false;
    });
  },
});

const fetchAsyncPartOfSpeech = createAsyncThunk(
  "/api/part_of_speech",
  async () => {
    const response: AxiosResponse<PartsOfSpeech> = await axios.get(
      "/api/part_of_speech"
    );
    return response.data;
  }
);

export { fetchAsyncPartOfSpeech };

export default partsOfSpeech.reducer;
