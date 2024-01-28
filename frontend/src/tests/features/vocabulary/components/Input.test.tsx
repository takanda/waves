import { render, screen, cleanup } from "@testing-library/react";
import { StoreType, storeSetUp, getPartOfSpeechResponse } from "../../../testUtils";
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
        expect(inputEls[2].id).toBe("2");
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
        expect(inputEls[2].id).toBe("1");
    });
    
    it("should delete all input areas for meanings after submission", async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const engInputEl = await screen.findByRole("textbox", { name: "english-word-input"});
        const checkboxEl = await screen.findByRole("checkbox", { name: "1-checkbox"});
        const buttonEl = await screen.findByRole("button", { name: "insert-button"});
        await userEvent.click(checkboxEl);
        const meaningInputEl = await screen.findByRole("textbox", { name: "1"})
        await userEvent.type(engInputEl, "Test");
        await userEvent.type(meaningInputEl, "テスト");
        await userEvent.click(buttonEl);
        const inputEls = await screen.findAllByRole("textbox");
        expect(inputEls).toHaveLength(2);
        expect(inputEls[1].id).toBe("english-word-input");
    });
});