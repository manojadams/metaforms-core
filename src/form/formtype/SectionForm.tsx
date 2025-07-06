import React, { useContext, useEffect, useRef } from "react";
import { IElementTypes, IForm, MetaformEvent } from "../../constants/common-interface";
import { IField, ISchema } from "../../constants/model-interfaces";
import { TCallback } from "../../constants/types";
import SectionLayout from "../SectionLayout";
import Footer from "../form-controls/Footer";
import FormContext from "../form-context";
import CustomFooter from "../form-controls/Footer/CustomFooter";

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: IForm;
    formButtons: Array<IField>;
    buttons?: IElementTypes;
    hasSection: boolean;
    useDefaultButtons: boolean;
    handleCustom: (e: React.MouseEvent, field: IField) => void;
    handleSubmit: (e: React.MouseEvent, field: IField) => void;
    handleReset: (e: React.MouseEvent, field: IField) => void;
    handleNext: (e: React.MouseEvent, field: IField, callback: TCallback) => void;
    handlePrevious: () => void;
}

const SectionForm = (props: IProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    const formContext = useContext(FormContext);

    const hasCustomFooter = formContext.hasFooter();

    useEffect(() => {
        const eventCallback = (e: MetaformEvent) => {
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
            {hasCustomFooter ? (
                <CustomFooter
                    buttons={props.buttons}
                    formButtons={props.formButtons}
                    onCustom={props.handleCustom}
                    onSubmit={props.handleSubmit}
                    onReset={props.handleReset}
                    onNext={props.handleNext}
                    onPrevious={props.handlePrevious}
                />
            ) : (
                <Footer
                    form={props.form}
                    buttons={props.buttons}
                    formButtons={props.formButtons}
                    useDefaultButtons={props.useDefaultButtons}
                    onCustom={props.handleCustom}
                    onSubmit={props.handleSubmit}
                    onReset={props.handleReset}
                    onNext={props.handleNext}
                    onPrevious={props.handlePrevious}
                />
            )}
        </form>
    );
};

export default SectionForm;
