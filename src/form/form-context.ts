import { EventEmitter } from "eventemitter3";
import React from "react";
import MetaForm from "../core/MetaForm";
import FormConfig from "../core/FormConfig";
import { DEFAULT } from "../constants/constants";

const FormContext = React.createContext(
    new MetaForm(
        {
            fields: [],
            buttons: []
        },
        new EventEmitter(),
        new FormConfig(DEFAULT)
    )
);

export default FormContext;
