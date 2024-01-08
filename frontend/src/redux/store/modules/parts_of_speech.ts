import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface PartsOfSpeechState {
  partsOfSpeech: {
    ja: string;
    en: string;
  }[];
  partsOfSpeechChecked: {
    ja: string;
    en: string;
  }[];
}

// Define the initial state using that type
const initialState: PartsOfSpeechState = {
  partsOfSpeech: [
    {
      ja: "加算名詞",
      en: "countable noun",
    },
    {
      ja: "不加算名詞",
      en: "uncountable noun",
    },
    {
      ja: "自動詞",
      en: "intransitive verb",
    },
    {
      ja: "他動詞",
      en: "transitive verb",
    },
    {
      ja: "形容詞",
      en: "adjective",
    },
    {
      ja: "副詞",
      en: "adverb",
    },
    {
      ja: "助動詞",
      en: "auxiliary verb",
    },
    {
      ja: "前置詞",
      en: "preposition",
    },
    {
      ja: "接続詞",
      en: "conjunction",
    },
    {
      ja: "フレーズ",
      en: "phrase",
    },
  ],
  partsOfSpeechChecked: [],
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
        (partOfSpeechChecked) => partOfSpeechChecked.ja !== payload.ja
      );
    },
  },
});

export const { addPartsOfSpeechChecked, removePartsOfSpeechChecked } =
  partsOfSpeech.actions;

export default partsOfSpeech.reducer;
