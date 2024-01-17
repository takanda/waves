import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import partsOfSpeechReducer from "../redux/modules/parts_of_speech";
import vocabularyReducer from "../redux/modules/vocabulary";
import { PartsOfSpeechState } from "../redux/modules/parts_of_speech";
import { VocabularyState } from "../redux/modules/vocabulary";

export type StoreType = EnhancedStore<{
  partsOfSpeech: PartsOfSpeechState;
  vocabulary: VocabularyState;
}>;

const storeSetUp = () => {
  const preloadedState = {
    partsOfSpeech: {
      partsOfSpeech: [],
      isLoading: true,
      isChecked: [],
    },
    vocabulary: {
      inputEnglish: "",
      inputMeanings: {},
      editingPosList: [],
    },
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

export { storeSetUp, getPartOfSpeechResponse };
