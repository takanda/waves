import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import partsOfSpeechReducer from "../redux/modules/parts_of_speech";
import vocabularyReducer from "../redux/modules/vocabulary";
import { PartsOfSpeechState } from "../redux/modules/parts_of_speech";
import { VocabularyState, initialState } from "../redux/modules/vocabulary";

export type StoreType = EnhancedStore<{
  partsOfSpeech: PartsOfSpeechState;
  vocabulary: VocabularyState;
}>;

const storeSetUp = () => {
  const preloadedState = {
    partsOfSpeech: {
      partsOfSpeech: [],
      isLoading: true,
    },
    vocabulary: initialState,
  };
  const store = configureStore({
    reducer: {
      partsOfSpeech: partsOfSpeechReducer,
      vocabulary: vocabularyReducer,
    },
    preloadedState: preloadedState,
  });
  return store;
};

const getPartOfSpeechResponse = {
  data: [
    {
      id: 1,
      ja_name: "可算名詞",
      en_name: "countable noun",
    },
    {
      id: 2,
      ja_name: "不可算名詞",
      en_name: "uncountable noun",
    },
  ],
};

const getVocabulary = {
  data: [
    {
      id: 1,
      search_text: "testtest",
      show_text: "Test Test",
      meaning: "意味1",
      created_at: "2024-01-16T16:18:21.007117+09:00",
      updated_at: "2024-01-25T11:59:59.968008+09:00",
      part_of_speech: 1,
    },
  ],
};

const getVocabularyList = {
  data: [
    {
      id: 1,
      search_text: "testtest",
      show_text: "Test Test",
      meaning: "意味1",
      created_at: "2024-01-16T16:18:21.007117+09:00",
      updated_at: "2024-01-25T11:59:59.968008+09:00",
      part_of_speech: 1,
    },
    {
      id: 2,
      search_text: "testtest2",
      show_text: "Test Test2",
      meaning: "意味2",
      created_at: "2024-01-16T16:18:21.007117+09:00",
      updated_at: "2024-01-25T11:59:59.968008+09:00",
      part_of_speech: 2,
    },
  ],
};

export {
  storeSetUp,
  getPartOfSpeechResponse,
  getVocabulary,
  getVocabularyList,
};
