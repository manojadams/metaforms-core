import React, { Fragment, useContext } from "react";
import { SECTION_LAYOUT } from "../constants/constants";
import { IField } from "../constants/model-interfaces";
import FormContext from "./form-context";
import FormGroup from "./form-group";
import BaseFormStepper from "./form-stepper/BaseFormStepper";
import BaseFormWizard from "./form-wizard/BaseFormWizard";

function SectionLayout(props: IProps) {
    const {
        theme: { type, sectionLayout }
    } = useContext(FormContext);
    switch (sectionLayout) {
        case SECTION_LAYOUT.TABS:
            return <FormGroup fields={props.fields} />;
        case SECTION_LAYOUT.WIZARD:
            return <BaseFormWizard fields={props.fields} theme={type} />;
        case SECTION_LAYOUT.STEPPER:
            return <BaseFormStepper fields={props.fields} theme={type} />;
    }
    return <Fragment />;
}

interface IProps {
    fields: Array<IField>;
    form: any;
}

export default SectionLayout;
