import axios from "axios";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { StoreType, storeSetUp, getPartOfSpeechResponse, getVocabulary, getVocabularyList } from "../../../testUtils";
import App from "../../../../App";
import userEvent from "@testing-library/user-event";


jest.mock("axios");

describe("Sidebar behavior by user activity.", () => {
    let store: StoreType;
    beforeEach(() => {
        store = storeSetUp();
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getPartOfSpeechResponse);
    });
    afterEach(cleanup);

    test("selected checkboxes become checked", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        await userEvent.click(checkboxEl);
        expect(checkboxEl).toBeChecked();
    });

    test("checked checkboxes do not exist after submission", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const engInputEl = await screen.findByRole("textbox", { name: "english-word-input" });
        const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        const buttonEl = await screen.findByRole("button", { name: "insert-button" });
        await userEvent.click(checkboxEl);
        const meaningInputEl = await screen.findByRole("textbox", { name: "1" })
        await userEvent.type(engInputEl, "Test");
        await userEvent.type(meaningInputEl, "テスト");
        await userEvent.click(buttonEl);
        const checkboxEls = await screen.findAllByRole("checkbox");
        for (let checkboxEl of checkboxEls) {
            expect(checkboxEl).not.toBeChecked();
        }
    });

    describe("Checkbox behavior when searching data", () => {
        test("checkboxes matching searching data's pos become checked when user search data using search textbox", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const inputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(inputEl, "Test Test");
            await userEvent.type(inputEl, "{enter}");
            const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
            expect(checkboxEl).toBeChecked();
        });
        test("checkboxes matching searching data's pos become checked when user search data using vocabulary list", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabularyList);
            await userEvent.click(await screen.findByRole("button", { name: "show-list-button" }));
            await userEvent.click(await screen.findByRole("button", { name: "Test Test2" }));
            const checkboxEl = await screen.findByRole("checkbox", { name: "2-checkbox" });
            expect(checkboxEl).toBeChecked();
        });
    });

    describe("Checkbox behavior after searching data", () => {
        test("checked checkboxes do not exist when user move to data insertion page", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const inputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(inputEl, "Test Test");
            await userEvent.type(inputEl, "{enter}");
            const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
            expect(checkboxEl).toBeChecked();
            await userEvent.click(await screen.findByRole("button", { name: "insert-vocabulary-button" }));
            expect(checkboxEl).not.toBeChecked();
        });
        test("checked checkboxes do not exist when user move to data list page", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const inputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(inputEl, "Test Test");
            await userEvent.type(inputEl, "{enter}");
            const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
            expect(checkboxEl).toBeChecked();
            await userEvent.click(await screen.findByRole("button", { name: "show-list-button" }));
            expect(checkboxEl).not.toBeChecked();
        });
        test("checked checkboxes are updated when user search another data", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabularyList);
            await userEvent.click(await screen.findByRole("button", { name: "show-list-button" }));
            await userEvent.click(await screen.findByRole("button", { name: "Test Test2" }));
            expect(await screen.findByRole("checkbox", { name: "2-checkbox" })).toBeChecked();
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const inputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(inputEl, "Test Test");
            await userEvent.type(inputEl, "{enter}");
            expect(await screen.findByRole("checkbox", { name: "2-checkbox" })).not.toBeChecked();
            expect(await screen.findByRole("checkbox", { name: "1-checkbox" })).toBeChecked();
        });
    });
});