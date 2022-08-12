import React from 'react';
import { render } from "@testing-library/react";
import FormRenderer from "../form-renderer";
import * as lschema_1 from "./data/large_schema1.json";
import * as schema_1 from "./data/schema_1.json";

describe('FormRenderer', () => {
    it('Schema render takes less than 500ms', () => {
        const start = window.performance.now();
        render(<FormRenderer 
            schema={lschema_1}
            onSubmit={() => {}}
        />)
        const end = window.performance.now();
        expect(end-start).toBeGreaterThan(200);
        expect(end-start).toBeLessThan(500);
    });

    it('Schema render takes less than 100ms', () => {
        const start = window.performance.now();
        render(<FormRenderer 
            schema={schema_1}
            onSubmit={() => {}}
        />)
        const end = window.performance.now();
        expect(end-start).toBeLessThan(100);
    });
});
