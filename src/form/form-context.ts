import { EventEmitter } from "eventemitter3";
import React from "react";
import { SECTION_LAYOUT } from "../constants/constants";
import MetaForm from "../core/MetaForm";
import Theme from "../core/Theme";

const FormContext = React.createContext(
    new MetaForm(
        {
            theme: new Theme({ type: "default", sectionLayout: SECTION_LAYOUT.DEFAULT }),
            fields: [],
            buttons: []
        },
        new EventEmitter()
    )
);

export default FormContext;
