import React, { Fragment, useContext } from "react";
import { IForm } from "../constants/common-interface";
import { SECTION_LAYOUT } from "../constants/constants";
import { IField } from "../constants/model-interfaces";
import FormContext from "./form-context";
import FormGroupRendere from "./form-group";
import BaseFormStepper from "./form-stepper/BaseFormStepper";
import BaseFormWizard from "./form-wizard/BaseFormWizard";

interface IProps {
    fields: Array<IField>;
    form: IForm;
}

function SectionLayout(props: IProps) {
    const {
        theme: { type, sectionLayout }
    } = useContext(FormContext);
    switch (sectionLayout) {
        case SECTION_LAYOUT.TABS:
            return <FormGroupRendere fields={props.fields} />;
        case SECTION_LAYOUT.WIZARD:
            return <BaseFormWizard fields={props.fields} theme={type} />;
        case SECTION_LAYOUT.STEPPER:
            return <BaseFormStepper fields={props.fields} theme={type} />;
    }
    return <Fragment />;
}

export default SectionLayout;
