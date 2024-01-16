import { Provider } from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { render, screen, cleanup } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import App from "../../../App";
import partsOfSpeechReducer, { PartsOfSpeechState } from "../../../redux/modules/parts_of_speech";
import vocabularyReducer, { VocabularyState } from "../../../redux/modules/vocabulary";


jest.mock("axios");


describe("Redux module 'vocabulary' behavior check", () => {
    let store: EnhancedStore<{ partsOfSpeech: PartsOfSpeechState; vocabulary: VocabularyState; }>;
    const preloadedState = {
        partsOfSpeech: {
            partsOfSpeech: [],
            partsOfSpeechChecked: [],
            isLoading: true,
        },
        vocabulary: {
            inputEnglish: "",
            inputMeanings: {},
            editingPosList: [],
        }
    };
    beforeEach(() => {
        store = configureStore({
            reducer: {
                partsOfSpeech: partsOfSpeechReducer,
                vocabulary: vocabularyReducer,
            },
            preloadedState: preloadedState,
        });
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
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
        });
    })
    afterEach(() => {
        cleanup();
    });

    it("should have one value in a list storing meanings when one part of speech is clicked", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        await userEvent.click(checkboxEl);
        expect(store.getState().vocabulary.editingPosList.length).toBe(1);
        expect(store.getState().vocabulary.editingPosList[0]).toBe(1);
    });
    it("should have one value in a list storing meanings when one part of speech is deleted after clicking two part of speech", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const checkboxEl1 = await screen.findByRole("checkbox", { name: "1-checkbox" });
        const checkboxEl2 = await screen.findByRole("checkbox", { name: "2-checkbox" });
        await userEvent.click(checkboxEl1);
        await userEvent.click(checkboxEl2);
        expect(store.getState().vocabulary.editingPosList.length).toBe(2);
        await userEvent.click(checkboxEl2);
        expect(store.getState().vocabulary.editingPosList.length).toBe(1);
        expect(store.getState().vocabulary.editingPosList[0]).toBe(1);
    });
});