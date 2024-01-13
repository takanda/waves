import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import App from "./App";
import axios from "axios";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import partsOfSpeechReducer, { PartsOfSpeechState } from "./redux/store/modules/parts_of_speech";


jest.mock("axios");

describe("Data registration operation check", () => {
    let store: EnhancedStore<{ partsOfSpeech: PartsOfSpeechState }>;;
    // テスト毎にstoreのstateを初期化するための設定
    const preloadedState = {
        partsOfSpeech: {
            partsOfSpeech: [],
            partsOfSpeechChecked: [],
            isLoading: true,
        },
    };
    describe("Sidebar operation check", () => {
        beforeEach(() => {
            store = configureStore({
                reducer: {
                    partsOfSpeech: partsOfSpeechReducer,
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
        });

        afterEach(() => {
            cleanup();
        });

        it("should add one input area when checkbox clicked", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
            await userEvent.click(checkboxEl);
            expect(await screen.findAllByRole("textbox")).toHaveLength(2);
        });

        it("should add one input area if two checkbox are clicked and then one of them is clicked again", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            const firstCheckboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
            const secondCheckboxEl = await screen.findByRole("checkbox", { name: "2-checkbox" });
            await userEvent.click(firstCheckboxEl);
            expect(await screen.findAllByRole("textbox")).toHaveLength(2);
            await userEvent.click(secondCheckboxEl);
            expect(await screen.findAllByRole("textbox")).toHaveLength(3);
            await userEvent.click(firstCheckboxEl);
            expect(await screen.findAllByRole("textbox")).toHaveLength(2);
        });
    });
});