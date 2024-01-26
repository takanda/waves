import { Provider } from "react-redux";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "../../../App";
import { StoreType, storeSetUp, getPartOfSpeechResponse, getVocabulary } from "../../testUtils";
import * as vocabulary from "../../../redux/modules/vocabulary";


jest.mock("axios");

describe("Redux module 'vocabulary' behavior check", () => {
    let store: StoreType;
    beforeEach(() => {
        store = storeSetUp();
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getPartOfSpeechResponse);
    })
    afterEach(() => {
        cleanup();
        jest.restoreAllMocks();
    });

    describe("State check when changing part of speech", () => {
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
        it("should have one key-value set storing meanings when one part of speech is clicked", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
            await userEvent.click(checkboxEl);
            expect(Object.entries(store.getState().vocabulary.inputMeanings).length).toBe(1);
            expect(Object.keys(store.getState().vocabulary.inputMeanings)[0]).toBe("1");
        });
    });

    describe("State check before vocabulary CRUD action", () => {
        describe("Insertion behavior check", () => {
            test("if postData is posted with an object having 'show_text', 'meaning', and 'pos' information when inserting a single record", async () => {
                render(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );
                const spy = jest.spyOn(vocabulary, "postAsyncVocabulary");
                const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
                const buttonEl = await screen.findByRole("button", { name: "insert-button" });
                await userEvent.click(checkboxEl);
                const englishInputEl = await screen.findByRole("textbox", { name: "english-word-input" });
                const meaningInputEl = await screen.findByRole("textbox", { name: "1" });
                await userEvent.type(englishInputEl, "Test");
                await userEvent.type(meaningInputEl, "テスト");
                await userEvent.click(buttonEl);
                expect(spy).toHaveBeenCalledWith({
                    show_text: "Test",
                    meaning: "テスト",
                    part_of_speech: 1,
                });
            });
            test("if postData is posted with a list with an object having 'show_text', 'meaning', and 'pos' information when inserting multiple records", async () => {
                render(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );
                const spy = jest.spyOn(vocabulary, "postAsyncVocabulary");
                const checkboxEl1 = await screen.findByRole("checkbox", { name: "1-checkbox" });
                const checkboxEl2 = await screen.findByRole("checkbox", { name: "2-checkbox" });
                const buttonEl = await screen.findByRole("button", { name: "insert-button" });
                await userEvent.click(checkboxEl1);
                await userEvent.click(checkboxEl2);
                const englishInputEl = await screen.findByRole("textbox", { name: "english-word-input" });
                const meaningInputEl1 = await screen.findByRole("textbox", { name: "1" });
                const meaningInputEl2 = await screen.findByRole("textbox", { name: "2" });
                await userEvent.type(englishInputEl, "Test");
                await userEvent.type(meaningInputEl1, "テスト1");
                await userEvent.type(meaningInputEl2, "テスト2");
                await userEvent.click(buttonEl);
                expect(spy).toHaveBeenCalledWith([
                    {
                        show_text: "Test",
                        meaning: "テスト1",
                        part_of_speech: 1,
                    },
                    {
                        show_text: "Test",
                        meaning: "テスト2",
                        part_of_speech: 2,
                    },
                ]);
            });
        });
        describe("Retrieve behavior check", () => {
            test("if query parameter is 'search_text' when user search vocabulary using sidebar input", async () => {
                render(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );
                jest.restoreAllMocks();
                (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
                const spy = jest.spyOn(vocabulary, "fetchAsyncVocabulary");
                const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
                await userEvent.type(searchInputEl, "Test");
                await userEvent.type(searchInputEl, "{enter}");
                expect(spy).toHaveBeenCalledWith("Test");
            });
            // test("if query parameter is 'search_text' when user click vocabulary detail link", async () => {
            // });
        });
        describe("Update behavior check", () => {
            test("if updateData is puted with a list with an object having 'id', 'show_text', 'meaning', 'created_at', 'updated_at' and 'pos' when user search vocabulary using sidebar input", async () => {
                render(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );
                jest.restoreAllMocks();
                const spy = jest.spyOn(vocabulary, "updateAsyncVocabulary");
                (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
                const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
                await userEvent.type(searchInputEl, "Test");
                await userEvent.type(searchInputEl, "{enter}");
                const meaningInputEl = await screen.findByRole("textbox", { name: "1" });
                const buttonEl = await screen.findByRole("button", { name: "update-button" });
                await userEvent.clear(meaningInputEl);
                await userEvent.type(meaningInputEl, "修正後意味1");
                await userEvent.click(buttonEl);
                expect(spy).toHaveBeenCalledWith([
                    {
                        id: 1,
                        search_text: "test",
                        show_text: "Test",
                        meaning: "修正後意味1",
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                        part_of_speech: 1
                    }
                ]);
            });
            // test("f updateData is puted with a list with an object having 'id', 'show_text', 'meaning', 'created_at', 'updated_at' and 'pos' when user click vocabulary detail link", async () => {
            // });
        });
        describe("Delete behavior check", () => {
            test("if query parameter is 'search_text' when user search vocabulary using sidebar input and click a delete button", async () => {
                render(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );
                jest.restoreAllMocks();
                const spy = jest.spyOn(vocabulary, "deleteAsyncVocabulary");
                (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
                const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
                await userEvent.type(searchInputEl, "Test");
                await userEvent.type(searchInputEl, "{enter}");
                const buttonEl = await screen.findByRole("button", { name: "delete-button" });
                await userEvent.click(buttonEl);
                expect(spy).toHaveBeenCalledWith("Test");
            })
        });
    });
});