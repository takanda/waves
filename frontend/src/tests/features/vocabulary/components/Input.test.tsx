import { render, screen, cleanup } from "@testing-library/react";
import { StoreType, storeSetUp, getPartOfSpeechResponse, getVocabulary, getVocabularyWithMultiMeaning } from "../../../testUtils";
import { Provider } from "react-redux";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import App from "../../../../App";

jest.mock("axios");

describe("Input area behavior by user activity", () => {
    let store: StoreType;
    beforeEach(() => {
        store = storeSetUp();
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getPartOfSpeechResponse);
    });
    afterEach(cleanup);

    test("user can two input areas when no part of speech is selected", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const inputEls = await screen.findAllByRole("textbox");
        expect(inputEls).toHaveLength(2);
    });
    test("user can edit the input area with part of speech selected", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        await userEvent.click(checkboxEl);

        const inputEls = await screen.findAllByRole("textbox");
        expect(inputEls).toHaveLength(3);
    });
    test("user cannot edit the input area for a part of speech if that part of speech is deselected", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const firstCheckboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        const secondCheckboxEl = await screen.findByRole("checkbox", { name: "2-checkbox" });
        await userEvent.click(firstCheckboxEl);
        await userEvent.click(secondCheckboxEl);
        await userEvent.click(firstCheckboxEl);

        const inputEls = await screen.findAllByRole("textbox");
        expect(inputEls).toHaveLength(3);
        expect(inputEls[2].id).toBe("2-0");
    });
    it("should render input areas in in ascending order no matter what order the user selects the parts of speech", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const firstCheckboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        const secondCheckboxEl = await screen.findByRole("checkbox", { name: "2-checkbox" });
        await userEvent.click(secondCheckboxEl);
        await userEvent.click(firstCheckboxEl);
        const inputEls = await screen.findAllByRole("textbox");
        expect(inputEls[2].id).toBe("1-0");
    });
    it("should delete all input areas for meanings after submission", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const engInputEl = await screen.findByRole("textbox", { name: "english-word-input" });
        const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox" });
        const buttonEl = await screen.findByRole("button", { name: "insert-button" });
        await userEvent.click(checkboxEl);
        const meaningInputEl = await screen.findByRole("textbox", { name: "1-0" })
        await userEvent.type(engInputEl, "Test");
        await userEvent.type(meaningInputEl, "テスト");
        await userEvent.click(buttonEl);
        const inputEls = await screen.findAllByRole("textbox");
        expect(inputEls).toHaveLength(2);
        expect(inputEls[1].id).toBe("english-word-input");
    });
    test("pressing the plus button to the right of the meaning input area at the top of each part of speech increases the number of input areas for that part of speech", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        await userEvent.click(await screen.findByRole("checkbox", { name: "1-checkbox" }));
        await userEvent.click(await screen.findByRole("button", { name: "plus-1-button"}));
        expect(await screen.findByRole("textbox", { name: "1-1"})).toBeInTheDocument();
        expect(await screen.findAllByRole("textbox")).toHaveLength(4);
    });
    test("pressing the minus button to the right of the meaning input area other than the top of each part of speech decreases the number of input boxes for that part of speech", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        await userEvent.click(await screen.findByRole("checkbox", { name: "1-checkbox" }));
        await userEvent.click(await screen.findByRole("button", { name: "plus-1-button"}));
        await userEvent.click(await screen.findByRole("button", { name: "minus-1-1-button"}));
        expect(await screen.findAllByRole("textbox")).toHaveLength(3);
    });

    describe("Input behavior when searching data", () => {
        test("meaning input areas matching searching data are created", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            expect(await screen.findByRole("textbox", { name: "1-0" })).toBeInTheDocument();
        });
        test("english word matching searching data is entered in english input area", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            const englishInputEl = await screen.findByRole("textbox", { name: "english-word-input" }) as HTMLInputElement;
            expect(englishInputEl.value).toBe("Test Test");
        });
        test("meanings matching searching data are entered in created meaning input areas", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            const meaningInputEl = await screen.findByRole("textbox", { name: "1-0" }) as HTMLInputElement;
            expect(meaningInputEl.value).toBe("意味1");
        });
    });
    
    describe("Input behavior after searching data", () => {
        test("english input area have no word when user move to data insertion page", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            await userEvent.click(await screen.findByRole("button", { name: "insert-vocabulary-button" }))
            const englishInputEl = await screen.findByRole("textbox", { name: "english-word-input" }) as HTMLInputElement;
            expect(englishInputEl.value).toBe("");
        });
        test("meaning input areas do not exist when user move to data insertion page", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            await userEvent.click(await screen.findByRole("button", { name: "insert-vocabulary-button" }))
            expect(await screen.findAllByRole("textbox")).toHaveLength(2);
        });
        test("english input area is updated when user search another data", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabularyWithMultiMeaning);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test2");
            await userEvent.type(searchInputEl, "{enter}");
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            const englishInputEl = await screen.findByRole("textbox", { name: "english-word-input" }) as HTMLInputElement;
            expect(englishInputEl.value).toBe("Test Test");
        });
        test("meaning input areas are updated when user search another data", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabularyWithMultiMeaning);
            const searchInputEl = await screen.findByRole("textbox", { name: "search-vocabulary" });
            await userEvent.type(searchInputEl, "Test Test2");
            await userEvent.type(searchInputEl, "{enter}");
            jest.restoreAllMocks();
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getVocabulary);
            await userEvent.type(searchInputEl, "Test Test");
            await userEvent.type(searchInputEl, "{enter}");
            const meaningInputEl = await screen.findByRole("textbox", { name: "1-0" }) as HTMLInputElement;
            expect(meaningInputEl.value).toBe("意味1");
            expect(screen.getAllByRole("textbox")).toHaveLength(3);
        });
    });
});