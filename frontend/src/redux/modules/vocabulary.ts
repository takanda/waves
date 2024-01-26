import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type PostData = {} | {}[];

export interface Vocabulary {
  id: number;
  search_text: string;
  show_text: string;
  meaning: string;
  created_at: string;
  updated_at: string;
  part_of_speech: number;
};

export interface VocabularyState {
  inputEnglish: string;
  inputMeanings: { [key: string]: string };
  searchText: string;
  editingPosList: number[];
  isUpdate: boolean;
  showVocabularyList: boolean;
  vocabularyList: Vocabulary[];
  editingVocabularyList: Vocabulary[];
}

export const initialState: VocabularyState = {
  inputEnglish: "",
  inputMeanings: {},
  searchText: "",
  editingPosList: [],
  isUpdate: false,
  showVocabularyList: false,
  vocabularyList: [],
  editingVocabularyList: [],
};

const vocabulary = createSlice({
  name: "vocabulary",
  initialState: initialState,
  reducers: {
    setEditingPosList(state, { payload }) {
      const index = state.editingPosList.indexOf(payload);
      if (index === -1) {
        state.editingPosList = [...state.editingPosList, payload].sort();
        if (!(payload in state.inputMeanings)) {
          state.inputMeanings = { ...state.inputMeanings, [payload]: "" };
        }
      } else {
        state.editingPosList.splice(index, 1);
      }
    },
    clearEditingPosList(state) {
      state.editingPosList = [];
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
    updateSearchText(state, { payload }) {
      state.searchText = payload;
    },
    setIsUpdate(state, { payload }) {
      state.isUpdate = payload;
    },
    setShowVocabularyList(state, { payload }) {
      state.showVocabularyList = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postAsyncVocabulary.fulfilled, (state) => {
      state.inputEnglish = "";
      state.inputMeanings = {};
      state.editingPosList = [];
    });
    builder.addCase(fetchAsyncVocabulary.fulfilled, (state, { payload }) => {
      if (payload && payload.length > 0) {
        state.editingVocabularyList = payload;
        state.isUpdate = true;
        state.searchText = "";
        state.inputEnglish = payload[0]["show_text"];
        for (const { meaning, part_of_speech } of payload) {
          state.editingPosList = [
            ...state.editingPosList,
            part_of_speech,
          ].sort();
          state.inputMeanings = {
            ...state.inputMeanings,
            [part_of_speech]: meaning,
          };
        }
      }
    });
    builder.addCase(
      fetchAsyncVocabularyList.fulfilled,
      (state, { payload }) => {
        state.vocabularyList = payload;
      }
    );
    builder.addCase(deleteAsyncVocabulary.fulfilled, (state) => {
      state.isUpdate = false;
      state.inputEnglish = "";
      state.inputMeanings = {};
      state.editingPosList = [];
    });
  },
});

const postAsyncVocabulary = createAsyncThunk(
  "/api/vocabulary/post",
  async (payload: PostData) => {
    const response = await axios.post("/api/vocabulary", payload);
    return response.data;
  }
);

const fetchAsyncVocabulary = createAsyncThunk(
  "/api/vocabulary/get",
  async (payload: string) => {
    const response = await axios.get(`/api/vocabulary?search_text=${payload}`);
    return response.data;
  }
);

const fetchAsyncVocabularyList = createAsyncThunk(
  "/api/vocabulary/list",
  async () => {
    const response = await axios.get("/api/vocabulary");
    return response.data;
  }
);

const updateAsyncVocabulary = createAsyncThunk(
  "/api/vocabulary/update",
  async (payload: Vocabulary[]) => {
    if(payload.length > 0) {
      const response = await axios.put(`/api/vocabulary/${payload[0].search_text}`, payload);
      return response.data;
    }
  }
)

const deleteAsyncVocabulary = createAsyncThunk(
  "/api/vocabulary/delete",
  async (payload: string) => {
    const response = await axios.delete(`/api/vocabulary/${payload}`);
    return response.data;
  }
);

const {
  setEditingPosList,
  clearEditingPosList,
  updateInputEnglish,
  updateInputMeanings,
  updateSearchText,
  setIsUpdate,
  setShowVocabularyList,
} = vocabulary.actions;

export {
  setEditingPosList,
  clearEditingPosList,
  updateInputEnglish,
  updateInputMeanings,
  updateSearchText,
  setIsUpdate,
  setShowVocabularyList,
  postAsyncVocabulary,
  fetchAsyncVocabulary,
  fetchAsyncVocabularyList,
  updateAsyncVocabulary,
  deleteAsyncVocabulary,
};

export default vocabulary.reducer;
