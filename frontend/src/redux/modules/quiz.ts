import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DictionaryEntry } from "./vocabulary";
import axios from "axios";


interface PostData {
    entry: string;
    result: string;
}

interface QuizState {
    message: { loading: string };
    isQuiz: boolean;
    isStart: boolean;
    dictionaryEntries: DictionaryEntry[];
    showAnswer: boolean[];
    currentIndex: number;
    quizResults: PostData[];
    failureQuizzes: string[];
}

const initialState: QuizState = {
    message: { loading: "" },
    isQuiz: false,
    isStart: false,
    dictionaryEntries: [],
    showAnswer: [],
    currentIndex: 0,
    quizResults: [],
    failureQuizzes: [],
}

const quiz = createSlice({
    name: "quiz",
    initialState: initialState,
    reducers: {
        setIsQuiz(state, { payload }) {
            state.isQuiz = payload;
        },
        setIsStart(state, { payload }) {
            state.isStart = payload;
        },
        setShowAnswer(state) {
            if (state.currentIndex < state.dictionaryEntries.length) {
                state.showAnswer = Array(state.dictionaryEntries[state.currentIndex].entry_definitions.length).fill(false);
            }
        },
        updateShowAnswer(state, { payload }) {
            state.showAnswer[payload] = true;
        },
        addCurrentIndex(state) {
            state.currentIndex += 1;
        },
        clearCurrentIndex(state) {
            state.currentIndex = 0;
        },
        updateDictionaryEntries(state, { payload }) {
            state.dictionaryEntries.push(state.dictionaryEntries[payload]);
        },
        clearDictionaryEntries(state) {
            state.dictionaryEntries = [];
        },
        updateQuizResults(state, { payload }) {
            if (!state.failureQuizzes.includes(payload.entry)) {
                state.quizResults.push(payload);
            }
        },
        clearQuizResults(state) {
            state.quizResults = [];
        },
        updateFailureQuizzes(state, { payload }) {
            if (!state.failureQuizzes.includes(payload)) {
                state.failureQuizzes.push(payload);
            }
        },
        clearFailureQuizzes(state) {
            state.failureQuizzes = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncQuizList.pending, (state) => {
            state.message.loading = "Loading...";
        });
        builder.addCase(fetchAsyncQuizList.fulfilled, (state, { payload }) => {
            state.dictionaryEntries = payload;
            state.currentIndex = 0;
            state.showAnswer = [];
            state.message.loading = "";
            if (state.dictionaryEntries.length) {
                state.showAnswer = Array(state.dictionaryEntries[state.currentIndex].entry_definitions.length).fill(false);
            }
        });
    }
});

const fetchAsyncQuizList = createAsyncThunk(
    "/quiz/start",
    async () => {
        const response = await axios.get("/quiz/start/");
        return response.data;
    }
);

const postAsyncQuiz = createAsyncThunk(
    "/quiz/end",
    async (payload: PostData[]) => {
        const response = await axios.post("/quiz/end/", payload);
        return response.data;
    }
);

export const { setIsQuiz, setIsStart, setShowAnswer, updateShowAnswer, addCurrentIndex, updateDictionaryEntries, updateQuizResults, updateFailureQuizzes, clearQuizResults, clearFailureQuizzes, clearCurrentIndex, clearDictionaryEntries } = quiz.actions;

export { fetchAsyncQuizList, postAsyncQuiz }

export default quiz.reducer
