import { EventEmitter } from "eventemitter3";
import React from "react";
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

export default FormContext;
