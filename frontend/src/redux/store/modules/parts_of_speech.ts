import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface PartsOfSpeechState {
  partsOfSpeech: {
    id: number,
    ja_name: string;
    en_name: string;
  }[];
  partsOfSpeechChecked: {
    id: number,
    ja_name: string;
    en_name: string;
  }[];
  isLoading: boolean;
}

const initialState: PartsOfSpeechState = {
  partsOfSpeech: [],
  partsOfSpeechChecked: [],
  isLoading: true,
};

const partsOfSpeech = createSlice({
  name: "parts_of_speech",
  initialState: initialState,
  reducers: {
    addPartsOfSpeechChecked(state, { payload }) {
      state.partsOfSpeechChecked = [...state.partsOfSpeechChecked, payload];
    },
    removePartsOfSpeechChecked(state, { payload }) {
      state.partsOfSpeechChecked = state.partsOfSpeechChecked.filter(
        (partOfSpeechChecked) => partOfSpeechChecked.id !== payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncPartOfSpeech.fulfilled, (state, { payload }) => {
      state.partsOfSpeech = payload;
      state.isLoading = false;
    });
  },
});

const fetchAsyncPartOfSpeech = createAsyncThunk(
  "/api/vocabulary/part_of_speech",
  async () => {
    const response = await axios.get("/api/vocabulary/part_of_speech");
    return response.data;
  }
);

const { addPartsOfSpeechChecked, removePartsOfSpeechChecked } =
  partsOfSpeech.actions;

export {
  addPartsOfSpeechChecked,
  removePartsOfSpeechChecked,
  fetchAsyncPartOfSpeech,
};

export default partsOfSpeech.reducer;
