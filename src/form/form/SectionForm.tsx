import React, { useEffect, useRef } from "react";
import { IElementTypes } from "../../constants/common-interface";
import { IField, ISchema, ITheme } from "../../constants/model-interfaces";
import Submit from "../form-controls/Submit";
import SectionLayout from "../SectionLayout";

const SectionForm = (props: IProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const eventCallback = (e: any) => {
            const eventType = e.detail?.eventType || "";
            switch (eventType) {
                case "previous":
                    props.handlePrevious();
                    break;
            }
        };
        const formElement: HTMLFormElement | null = formRef.current;
        if (formElement) {
            formElement.addEventListener("action", eventCallback);
        }
        return () => {
            if (formElement) {
                formElement.removeEventListener("action", eventCallback);
            }
        };
    }, [formRef]);
    return (
        <form
            name="metaform"
            ref={formRef}
            className={`needs-validation ${props.validated ? "was-validated" : ""}`}
            noValidate
        >
            <SectionLayout fields={props.schema.fields} form={props.form} />
            <Submit
                theme={props.theme.type}
                form={props.form}
                buttons={props.buttons}
                formButtons={props.formButtons}
                onCustom={props.handleCustom}
                onSubmit={props.handleSubmit}
                onReset={props.handleReset}
                onNext={props.handleNext}
                onPrevious={props.handlePrevious}
            />
        </form>
    );
};

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: any;
    formButtons: Array<IField>;
    buttons?: IElementTypes;
    theme: ITheme;
    hasSection: boolean;
    handleCustom: (e: React.MouseEvent, field: IField) => void;
    handleSubmit: (e: React.MouseEvent, field: IField) => void;
    handleReset: (e: React.MouseEvent, field: IField) => void;
    handleNext: (e: React.MouseEvent, field: IField, callback: any) => void;
    handlePrevious: () => void;
}

export default SectionForm;
