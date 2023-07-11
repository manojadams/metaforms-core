import { EventEmitter } from "eventemitter3";
import React from "react";
import MetaForm from "../core/MetaForm";
import FormConfig from "../core/FormConfig";

const FormContext = React.createContext(
    new MetaForm(
        {
            fields: [],
            buttons: []
        },
        new EventEmitter(),
        new FormConfig("default")
    )
);

export default FormContext;
