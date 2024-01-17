import { Provider } from "react-redux";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "../../../App";
import { StoreType, storeSetUp, getPartOfSpeechResponse } from "../../testUtils";


jest.mock("axios");

describe("Redux module 'vocabulary' behavior check", () => {
    let store: StoreType;
    beforeEach(() => {
        store = storeSetUp();
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(getPartOfSpeechResponse);
    })
        afterEach(cleanup);


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