import React from 'react';
import { render } from "@testing-library/react";
import FormRenderer from "../FormRenderer";
import * as schema_1 from "./data/schema_1.json";

describe('FormRenderer', () => {
    it('is truthy', () => {
        expect(FormRenderer).toBeTruthy();
    });
    it('Min. schema test', () => {
        render(<FormRenderer  
            schema={{fields:[]}}
            onSubmit={()=>{}} />)
    });
    it('Schema 1 test', () => {
        render(<FormRenderer 
            schema={schema_1}
            onSubmit={() => {}}
        />)
    });
});
