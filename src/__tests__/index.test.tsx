import React from "react";
import { render } from "@testing-library/react";
import FormRenderer from "../FormRenderer";
import * as schema1 from "./data/schema_1.json";

describe("FormRenderer", () => {
    it("is truthy", () => {
        expect(FormRenderer).toBeTruthy();
    });
    it("Min. schema test", () => {
        const output = render(
            <FormRenderer
                schema={{ fields: [] }}
                onSubmit={() => {
                    console.log("Schema submit");
                }}
            />
        );
        expect(output.getByText("")).toBeTruthy();
    });
    it("Schema 1 test", () => {
        render(
            <FormRenderer
                schema={schema1}
                onSubmit={() => {
                    console.log("Schema1 submit");
                }}
            />
        );
    });
});
