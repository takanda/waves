import { configureStore } from "@reduxjs/toolkit";
import partsOfSpeechReducer from "./modules/parts_of_speech";

const store = configureStore({
    reducer: {
        partsOfSpeech: partsOfSpeechReducer,
    }
});

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
