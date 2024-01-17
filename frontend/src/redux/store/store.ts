import { configureStore } from "@reduxjs/toolkit";
import partsOfSpeechReducer from "../modules/parts_of_speech";
import vocabularyReducer from "../modules/vocabulary";


const store = configureStore({
    reducer: {
        partsOfSpeech: partsOfSpeechReducer,
        vocabulary: vocabularyReducer,
    }
});

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
