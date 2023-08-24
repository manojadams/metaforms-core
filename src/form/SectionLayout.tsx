import React, { useContext } from "react";
import { IForm } from "../constants/common-interface";
import { SECTION_LAYOUT } from "../constants/constants";
import { IField } from "../constants/model-interfaces";
import FormContext from "./form-context";
import FormGroupRenderer from "./form-group";
import FormGroupStepper from "./form-stepper";
import FormGroupWizard from "./form-wizard";

interface IProps {
    fields: Array<IField>;
    form: IForm;
}

function SectionLayout(props: IProps) {
    const {
        formConfig: { type, sectionLayout }
    } = useContext(FormContext);
    switch (sectionLayout) {
        case SECTION_LAYOUT.WIZARD:
            return <FormGroupWizard fields={props.fields} theme={type} />;
        case SECTION_LAYOUT.STEPPER:
            return <FormGroupStepper fields={props.fields} theme={type} />;
        case SECTION_LAYOUT.TABS:
        default:
            return <FormGroupRenderer fields={props.fields} />;
    }
}

export default SectionLayout;
