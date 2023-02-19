import { EventEmitter } from "eventemitter3";
import React from "react";
import FormImpls from "../core/FormImpl";
import MetaForm from "../core/MetaForm";
import Theme from "../core/Theme";

const FormContext = React.createContext(
    new MetaForm(
        {
            theme: new Theme({ type: "default", sectionLayout: "default" }),
            fields: [],
            buttons: []
        },
        new EventEmitter()
    )
);

const FormImplsContext = React.createContext(new FormImpls());

export { FormImplsContext };

export default FormContext;
