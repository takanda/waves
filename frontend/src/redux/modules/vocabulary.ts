import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface PostData {
  entry: string;
  entry_definitions: { meaning: string, part_of_speech: number }[];
}

export interface PutData {
  entry: string;
  entry_definitions: { id: number, meaning: string, part_of_speech: number }[];
}

export interface VocabularyState {
  entry: string;
  meanings: { [key: string]: string[] };
  searchEntry: string;
  editingPosList: number[];
  isUpdate: boolean;
  isVisibleVocabularies: boolean;
  entries: string[];
  updateDefinitionIds: { [key: string]: number[] };
}

export const initialState: VocabularyState = {
  entry: "",
  meanings: {},
  searchEntry: "",
  editingPosList: [],
  isUpdate: false,
  isVisibleVocabularies: false,
  entries: [],
  updateDefinitionIds: {},
};

const vocabulary = createSlice({
  name: "vocabulary",
  initialState: initialState,
  reducers: {
    setEditingPosList(state, { payload }) {
      const index = state.editingPosList.indexOf(payload);
      if (index === -1) {
        state.editingPosList = [...state.editingPosList, payload].sort();
        if (!(payload in state.meanings)) {
          state.meanings = { ...state.meanings, [payload]: [""] };
        }
      } else {
        state.editingPosList.splice(index, 1);
      }
    },
    clearEditingPosList(state) {
      state.editingPosList = [];
    },
    updateInputEnglish(state, { payload }) {
      state.entry = payload;
    },
    addInputMeanings(state, { payload }) {
      state.meanings = { ...state.meanings, [payload]: [...state.meanings[payload], ""] };
    },
    minusInputMeanings(state, { payload }) {
      const { partOfSpeechId, index } = payload;
      const updatedInputMeanings = { ...state.meanings };
      updatedInputMeanings[partOfSpeechId] = state.meanings[partOfSpeechId].filter((_, i) => i !== index);
      state.meanings = updatedInputMeanings;
    },
    updateInputMeanings(state, { payload }) {
      const id = payload.id.split("-");
      state.meanings[id[0]][id[1]] = payload.inputMeaning;
    },
    clearInputMeanings(state) {
      state.meanings = {};
    },
    updateSearchText(state, { payload }) {
      state.searchEntry = payload;
    },
    setIsUpdate(state, { payload }) {
      state.isUpdate = payload;
    },
    setIsVisibleVocabularies(state, { payload }) {
      state.isVisibleVocabularies = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postAsyncVocabulary.fulfilled, (state) => {
      state.entry = "";
      state.meanings = {};
      state.editingPosList = [];
    });
    builder.addCase(fetchAsyncVocabulary.fulfilled, (state, { payload }) => {
      if (payload) {
        state.meanings = {};
        state.editingPosList = [];
        state.updateDefinitionIds = {};
        state.isUpdate = true;
        state.searchEntry = "";
        state.entry = payload.entry;
        for (const definition of payload.entry_definitions) {
          if (state.editingPosList.includes(definition.part_of_speech)) {
            state.updateDefinitionIds = { ...state.updateDefinitionIds, [definition.part_of_speech]: [...state.updateDefinitionIds[definition.part_of_speech], definition.id] }
            state.meanings = { ...state.meanings, [definition.part_of_speech]: [...state.meanings[definition.part_of_speech], definition.meaning] };
          } else {
            state.editingPosList = [...state.editingPosList, definition.part_of_speech].sort();
            state.updateDefinitionIds = { ...state.updateDefinitionIds, [definition.part_of_speech]: [definition.id] }
            state.meanings = { ...state.meanings, [definition.part_of_speech]: [definition.meaning] }
          }
        }
      }
    });
    builder.addCase(
      fetchAsyncVocabularyList.fulfilled,
      (state, { payload }) => {
        state.entries = [];
        for (const vocabulary of payload) {
          state.entries.push(vocabulary.entry);
        }
      }
    );
    builder.addCase(updateAsyncVocabulary.fulfilled, (state) => {
      state.isUpdate = false;
      state.entry = "";
      state.meanings = {};
      state.editingPosList = [];  
    });
    builder.addCase(deleteAsyncVocabulary.fulfilled, (state) => {
      state.isUpdate = false;
      state.entry = "";
      state.meanings = {};
      state.editingPosList = [];
    });
    builder.addCase(deleteAsyncDefinition.fulfilled, (state) => {
      state.isUpdate = false;
      state.entry = "";
      state.meanings = {};
      state.editingPosList = [];
    });
  },
});

const postAsyncVocabulary = createAsyncThunk(
  "/api/dictionary/post",
  async (payload: PostData) => {
    const response = await axios.post("/api/dictionary/", payload);
    return response.data;
  }
);

const fetchAsyncVocabulary = createAsyncThunk(
  "/api/dictionary/get",
  async (payload: string) => {
    const response = await axios.get(`/api/dictionary/${payload}/`);
    return response.data;
  }
);

const fetchAsyncVocabularyList = createAsyncThunk(
  "/api/dictionary/list",
  async () => {
    const response = await axios.get("/api/dictionary");
    return response.data;
  }
);

const updateAsyncVocabulary = createAsyncThunk(
  "/api/dictionary/update",
  async (payload: PutData) => {
    const response = await axios.put(`/api/dictionary/${payload.entry}/`, payload);
    return response.data;
  }
);

const deleteAsyncVocabulary = createAsyncThunk(
  "/api/dictionary/delete",
  async (payload: string) => {
    const response = await axios.delete(`/api/dictionary/${payload}/`);
    return response.data;
  }
);

const deleteAsyncDefinition = createAsyncThunk(
  "/api/definition/delete",
  async (payload: { deleted_definition_ids: number[] }) => {
    await axios.post("/api/definition", payload);
  }
)

const {
  setEditingPosList,
  clearEditingPosList,
  updateInputEnglish,
  addInputMeanings,
  minusInputMeanings,
  updateInputMeanings,
  clearInputMeanings,
  updateSearchText,
  setIsUpdate,
  setIsVisibleVocabularies,
} = vocabulary.actions;

export {
  setEditingPosList,
  clearEditingPosList,
  updateInputEnglish,
  addInputMeanings,
  minusInputMeanings,
  updateInputMeanings,
  clearInputMeanings,
  updateSearchText,
  setIsUpdate,
  setIsVisibleVocabularies,
  postAsyncVocabulary,
  fetchAsyncVocabulary,
  fetchAsyncVocabularyList,
  updateAsyncVocabulary,
  deleteAsyncVocabulary,
  deleteAsyncDefinition,
};

export default vocabulary.reducer;
