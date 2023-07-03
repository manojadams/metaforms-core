import { EventEmitter } from "eventemitter3";
import React from "react";
import MetaForm from "../core/MetaForm";

const FormContext = React.createContext(
    new MetaForm(
        {
            fields: [],
            buttons: []
        },
        new EventEmitter()
    )
);

export default FormContext;
