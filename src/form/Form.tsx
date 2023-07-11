import React, { SyntheticEvent } from "react";
import { IElementTypes, IForm } from "../constants/common-interface";
import { EVENTS, FORM_ACTION, SECTION_LAYOUT } from "../constants/constants";
import { IField, ISchema } from "../constants/model-interfaces";
import { TCallback, TSectionLayout } from "../constants/types";
import FormUtils from "../utils/FormUtil";
import DefaultForm from "./formtype/DefaultForm";
import SectionForm from "./formtype/SectionForm";

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: IForm;
    sectionLayout?: TSectionLayout;
    onCustom: (e?: React.MouseEvent) => void;
    onPrevious: (e?: React.MouseEvent, data?: IForm) => void;
    onNext: () => Promise<boolean | void>;
    onSubmit: (e: React.MouseEvent, data?: IForm) => void;
    emit: (
        event: string,
        param: {
            payload: string;
            callback?: () => void;
        }
    ) => void;
    buttons?: IElementTypes;
    useNextResponse?: boolean;
    validate: (e: SyntheticEvent, type: string) => boolean;
    formValidated: (validated: boolean) => void;
}

function Form(props: IProps) {
    const hasSection = FormUtils.hasSections(props.schema.fields);
    const sectionLayout = props.sectionLayout;
    const formButtons =
        props.schema.buttons && props.schema.buttons.length > 0
            ? props.schema.buttons
            : hasSection
            ? FormUtils.getFormGroupDefaultButtons()
            : FormUtils.getFormDefaultButtons();

    const handleSubmit = (e: React.MouseEvent) => {
        if (props.validate(e, FORM_ACTION.SUBMIT)) {
            if (props.onSubmit) {
                const data = props.form;
                props.onSubmit(e, data);
            }
        }
        props.formValidated(true);
    };

    const handleReset = (e: React.MouseEvent) => {
        console.log("Reset handler triggered", e);
    };

    const handleCustom = (e: React.MouseEvent) => {
        props.onCustom(e);
    };

    const handleNext = async (e: React.MouseEvent, section: IField, callback: TCallback) => {
        if (props.validate(e, FORM_ACTION.NEXT)) {
            if (props.useNextResponse === true) {
                const result = await props.onNext();
                if (result) {
                    props.emit(EVENTS.SWITCH, {
                        payload: FORM_ACTION.NEXT,
                        callback
                    });
                }
            } else {
                props.onNext();
                props.emit(EVENTS.SWITCH, { payload: FORM_ACTION.NEXT, callback });
            }
        } else {
            props.emit(EVENTS.VALIDATION_ERROR, { payload: section.name });
        }
    };

    const handlePrevious = () => {
        props.emit(EVENTS.SWITCH, { payload: FORM_ACTION.PREVIOUS });
        props.onPrevious();
    };
    if (hasSection && sectionLayout !== SECTION_LAYOUT.DEFAULT) {
        return (
            <SectionForm
                {...props}
                formButtons={formButtons}
                useDefaultButtons={!(props.schema.buttons && props.schema.buttons.length > 0)}
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
                useDefaultButtons={!(props.schema.buttons && props.schema.buttons.length > 0)}
                handleCustom={handleCustom}
                handleSubmit={handleSubmit}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                handleReset={handleReset}
            />
        );
    }
}

export default Form;
