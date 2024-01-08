import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store/store";



describe("Data registration operation check", () => {
    describe("Sidebar operation check", () => {

        it("should add one input area when checkbox clicked", async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
            const checkboxEl = screen.getByRole("checkbox", { name: "countable noun-checkbox" });
            await userEvent.click(checkboxEl);
            expect(await screen.findAllByRole("textbox")).toHaveLength(2);
        });

        it("should add one input area if two checkbox are clicked and then one of them is clicked again",
            async () => {
                render(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );
                const firstCheckboxEl = screen.getByRole("checkbox", { name: "countable noun-checkbox" });
                const secondCheckboxEl = screen.getByRole("checkbox", { name: "uncountable noun-checkbox" });
                await userEvent.click(firstCheckboxEl);
                await userEvent.click(secondCheckboxEl);
                await userEvent.click(firstCheckboxEl);
                expect(await screen.findAllByRole("textbox")).toHaveLength(2);
            });
    });
});