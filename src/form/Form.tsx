import React, { SyntheticEvent } from "react";
import { IElementTypes } from "../constants/common-interface";
import { EVENTS, SECTION_LAYOUT } from "../constants/constants";
import { IField, ISchema, ITheme } from "../constants/model-interfaces";
import FormUtils from "../utils/FormUtil";
import DefaultForm from "./formtype/DefaultForm";
import SectionForm from "./formtype/SectionForm";

export default function (props: IProps) {
    const hasSection = FormUtils.hasSections(props.schema.fields);
    const sectionLayout = props.theme.sectionLayout;
    const formButtons =
        props.schema.buttons && props.schema.buttons.length > 0
            ? props.schema.buttons
            : FormUtils.getFormDefaultButtons();

    const handleSubmit = (e: any, field: IField) => {
        if (props.validate(e, "submit")) {
            if (props.onSubmit) {
                const data = props.form;
                props.onSubmit(e, data);
            }
        }
        props.formValidated(true);
    };

    const handleReset = (e: any, field: IField) => {
        // to do
    };

    const handleCustom = (e: any, field: IField) => {
        props.onCustom(e);
    };

    const handleNext = async (e: SyntheticEvent, section: IField, callback: any) => {
        if (props.validate(e, "next")) {
            if (props.useNextResponse === true) {
                const result = await props.onNext();
                if (result === true) {
                    props.emit(EVENTS.SWITCH, {
                        payload: "next",
                        callback
                    });
                }
            } else {
                props.onNext();
                props.emit(EVENTS.SWITCH, { payload: "next", callback });
            }
        } else {
            props.emit(EVENTS.VALIDATION_ERROR, { payload: section.name });
        }
    };

    const handlePrevious = () => {
        props.emit(EVENTS.SWITCH, { payload: "previous" });
        props.onPrevious();
    };
    if (hasSection && sectionLayout !== SECTION_LAYOUT.DEFAULT) {
        return (
            <SectionForm
                {...props}
                formButtons={formButtons}
                hasSection={hasSection}
                handleSubmit={handleSubmit}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                handleReset={handleReset}
                handleCustom={handleCustom}
            />
        );
    } else {
        return (
            <DefaultForm
                {...props}
                formButtons={formButtons}
                hasSection={hasSection}
                handleCustom={handleCustom}
                handleSubmit={handleSubmit}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                handleReset={handleReset}
            />
        );
    }
}

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: any;
    theme: ITheme;
    onCustom: Function;
    onPrevious: Function;
    onNext: Function;
    onSubmit: Function;
    emit: Function;
    buttons?: IElementTypes;
    useNextResponse?: boolean;
    validate: (e: SyntheticEvent, type: string) => boolean;
    formValidated: (validated: boolean) => void;
}
