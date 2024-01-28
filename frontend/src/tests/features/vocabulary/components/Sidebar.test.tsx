import axios from "axios";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { StoreType, storeSetUp, getPartOfSpeechResponse } from "../../../testUtils";
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
        const buttonEl = await screen.findByRole("button", { name: "insert-button"});
        await userEvent.click(checkboxEl);
        const meaningInputEl = await screen.findByRole("textbox", { name: "1" })
        await userEvent.type(engInputEl, "Test");
        await userEvent.type(meaningInputEl, "テスト");
        await userEvent.click(buttonEl);
        const checkboxEls = await screen.findAllByRole("checkbox");
        for(let checkboxEl of checkboxEls) {
            expect(checkboxEl).not.toBeChecked();
        }
    });
});