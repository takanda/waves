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

export interface DictionaryEntry {
  entry: string;
  entry_definitions: { id: number, meaning: string, part_of_speech: number }[];
  created_at: string;
  updated_at: string;
}

export type OrderTarget = "entry" | "created_at" | "updated_at";

export interface VocabularyState {
  entry: string;
  meanings: { [key: string]: string[] };
  searchEntry: string;
  editingPosList: number[];
  isUpdate: boolean;
  isSearch: boolean;
  isVisibleVocabularies: boolean;
  dictionaryEntries: DictionaryEntry[];
  updateDefinitionIds: { [key: string]: number[] };
  validationResult: { isInputEntryError: boolean, errorMessage: {inputEntry: string, searchEntry: string} };
}

export const initialState: VocabularyState = {
  entry: "",
  meanings: {},
  searchEntry: "",
  editingPosList: [],
  isUpdate: false,
  isSearch: false,
  isVisibleVocabularies: false,
  dictionaryEntries: [],
  updateDefinitionIds: {},
  validationResult: { isInputEntryError: false, errorMessage: {inputEntry: "", searchEntry: ""} },
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
    setEntry(state, { payload }) {
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
    setSearchEntry(state, { payload }) {
      state.searchEntry = payload;
    },
    setIsUpdate(state, { payload }) {
      state.isUpdate = payload;
    },
    setIsSearch(state, { payload }) {
      state.isSearch = payload;
    },
    setIsVisibleVocabularies(state, { payload }) {
      state.isVisibleVocabularies = payload;
    },
    clearValidationError(state) {
      state.validationResult.errorMessage = {inputEntry: "", searchEntry: ""};
    },
    setAscOrder(state, { payload }: { payload: OrderTarget}) {
      state.dictionaryEntries.sort((a, b) => {
        if (a[payload] > b[payload]) {
          return 1;
        }
        if (a[payload] < b[payload]) {
          return -1;
        }
        return 0;
      })
    },
    setDescOrder(state, { payload }: { payload: OrderTarget}) {
      state.dictionaryEntries.sort((a, b) => {
        if (a[payload] > b[payload]) {
          return -1;
        }
        if (a[payload] < b[payload]) {
          return 1;
        }
        return 0;
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postAsyncVocabulary.fulfilled, (state) => {
      state.entry = "";
      state.meanings = {};
      state.editingPosList = [];
    });
    builder.addCase(fetchAsyncVocabulary.fulfilled, (state, { payload }) => {
      state.validationResult.errorMessage.searchEntry = "";
      state.meanings = {};
      state.editingPosList = [];
      state.updateDefinitionIds = {};
      state.isUpdate = true;
      state.isSearch = false;
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
    });
    builder.addCase(fetchAsyncVocabulary.rejected, (state) => {
      state.validationResult.errorMessage.searchEntry = "見つかりませんでした";
    });
    builder.addCase(
      fetchAsyncVocabularyList.fulfilled,
      (state, { payload }) => {
        state.dictionaryEntries = [];
        for (const dictionaryEntry of payload) {
          state.dictionaryEntries.push(dictionaryEntry);
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
    builder.addCase(checkAsyncEntry.fulfilled, (state, { payload }) => {
      if (payload && "error_message" in payload) {
        state.validationResult.isInputEntryError = true;
        state.validationResult.errorMessage.inputEntry = payload.error_message;
      } else {
        state.validationResult.isInputEntryError = false;
        state.validationResult.errorMessage.inputEntry = "";
      }
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
    if (payload) {
      const response = await axios.get(`/api/dictionary/${payload}/`);
      return response.data;
    }
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

const postAsyncDefinition = createAsyncThunk(
  "/api/definition/post",
  async (payload: PostData) => {
    const response = await axios.post("/api/definition/create", payload);
    return response.data;
  }
)

const deleteAsyncDefinition = createAsyncThunk(
  "/api/definition/delete",
  async (payload: { deleted_definition_ids: number[] }) => {
    await axios.post("/api/definition/delete", payload);
  }
);

const checkAsyncEntry = createAsyncThunk(
  "/api/check_entry",
  async (payload: string) => {
    if (payload) {
      const response = await axios.get(`/api/check_entry/${payload}`);
      return response.data;
    }
  }
);

export const {
  setEditingPosList,
  clearEditingPosList,
  setEntry,
  addInputMeanings,
  minusInputMeanings,
  updateInputMeanings,
  clearInputMeanings,
  setSearchEntry,
  setIsUpdate,
  setIsSearch,
  setIsVisibleVocabularies,
  clearValidationError,
  setAscOrder,
  setDescOrder,
} = vocabulary.actions;

export {
  postAsyncVocabulary,
  fetchAsyncVocabulary,
  fetchAsyncVocabularyList,
  updateAsyncVocabulary,
  deleteAsyncVocabulary,
  postAsyncDefinition,
  deleteAsyncDefinition,
  checkAsyncEntry,
};

export default vocabulary.reducer;
