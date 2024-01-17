import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface VocabularyState {
  inputEnglish: string;
  inputMeanings: { [key: string]: string };
  editingPosList: string[];
}

type PostData = {} | {}[];

const initialState: VocabularyState = {
  inputEnglish: "",
  inputMeanings: {},
  editingPosList: [],
};

const vocabulary = createSlice({
  name: "vocabulary",
  initialState: initialState,
  reducers: {
    addEditingPosList(state, { payload }) {
      state.editingPosList = [...state.editingPosList, payload].sort();
      if (!(payload in state.inputMeanings)) {
        state.inputMeanings = { ...state.inputMeanings, [payload]: "" };
      }
    },
    removeEditingPosList(state, { payload }) {
      state.editingPosList = state.editingPosList.filter(
        (editingPos) => editingPos !== payload
      );
    },
    updateInputEnglish(state, { payload }) {
      state.inputEnglish = payload;
    },
    updateInputMeanings(state, { payload }) {
      state.inputMeanings = {
        ...state.inputMeanings,
        [payload.id]: payload.inputMeaning,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postAsyncVocabulary.fulfilled, (state, { payload }) => {
      state.inputEnglish = "";
      state.inputMeanings = {};
      state.editingPosList = [];
    })
  }
});

const postAsyncVocabulary = createAsyncThunk(
  "/api/vocabulary/insert",
  async (payload: PostData) => {
    const response = await axios.post("/api/vocabulary/insert", payload);
    return response.data;
  }
);

const {
  addEditingPosList,
  removeEditingPosList,
  updateInputEnglish,
  updateInputMeanings,
} = vocabulary.actions;

export {
  addEditingPosList,
  removeEditingPosList,
  updateInputEnglish,
  updateInputMeanings,
  postAsyncVocabulary,
};

export default vocabulary.reducer;
