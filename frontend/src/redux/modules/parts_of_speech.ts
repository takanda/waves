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
  isChecked: number[];
}

const initialState: PartsOfSpeechState = {
  partsOfSpeech: [],
  isLoading: true,
  isChecked: [],
};

const partsOfSpeech = createSlice({
  name: "parts_of_speech",
  initialState: initialState,
  reducers: {
    setIsChecked(state, { payload }) {
      const index = state.isChecked.indexOf(payload)
      if(index === -1) {
        state.isChecked.push(payload);
      } else {
        state.isChecked.splice(index, 1);
      }
    },
    clearIsChecked(state) {
      state.isChecked = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncPartOfSpeech.fulfilled, (state, { payload }) => {
      state.partsOfSpeech = payload;
      state.isChecked = [];
      state.isLoading = false;
    });
  },
});

const fetchAsyncPartOfSpeech = createAsyncThunk(
  "/api/vocabulary/part_of_speech",
  async () => {
    const response: AxiosResponse<PartsOfSpeech> = await axios.get(
      "/api/vocabulary/part_of_speech"
    );
    return response.data;
  }
);

const {
  setIsChecked,
  clearIsChecked,
} = partsOfSpeech.actions;

export {
  fetchAsyncPartOfSpeech,
  setIsChecked,
  clearIsChecked,
};

export default partsOfSpeech.reducer;
