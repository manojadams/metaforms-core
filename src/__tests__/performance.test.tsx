import React from "react";
import { render } from "@testing-library/react";
import FormRenderer from "../FormRenderer";
import * as lSchema1 from "./data/large_schema1.json";
import * as schema1 from "./data/schema_1.json";

describe("FormRenderer", () => {
    it("Schema render takes less than 500ms", () => {
        const start = window.performance.now();
        // eslint-disable-next-line @typescript-eslint/camelcase
        render(<FormRenderer schema={lSchema1} onSubmit={() => {}} />);
        const end = window.performance.now();
        expect(end - start).toBeGreaterThan(200);
        expect(end - start).toBeLessThan(500);
    });

    it("Schema render takes less than 100ms", () => {
        const start = window.performance.now();
        render(<FormRenderer schema={schema1} onSubmit={() => {}} />);
        const end = window.performance.now();
        expect(end - start).toBeLessThan(100);
    });
});
