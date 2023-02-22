import React, { useState } from "react";
import { IElementTypes, IForm } from "../../constants/common-interface";
import { SECTION_LAYOUT } from "../../constants/constants";
import { IField, ISchema, ITheme } from "../../constants/model-interfaces";
import { TCallback } from "../../constants/types";
import Submit from "../form-controls/Submit";
import FormFieldRenderer from "../FormFieldRenderer";

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: IForm;
    formButtons: Array<IField>;
    buttons?: IElementTypes;
    theme: ITheme;
    hasSection: boolean;
    handleCustom: (e: React.MouseEvent, field: IField) => void;
    handleSubmit: (e: React.MouseEvent, field: IField) => void;
    handleReset: (e: React.MouseEvent, field: IField) => void;
    handleNext: (e: React.MouseEvent, field: IField, callback: TCallback) => void;
    handlePrevious: () => void;
}

const DefaultForm = (props: IProps) => {
    const [fields, setFields] = useState(props.schema.fields);
    const sync = () => {
        setFields([...fields]);
    };
    return (
        <form name="metaform" className={`needs-validation ${props.validated ? "was-validated" : ""}`} noValidate>
            <div className="row">
                {props.schema.fields.map((field: IField) => (
                    <FormFieldRenderer
                        {...field}
                        key={field.name}
                        section={SECTION_LAYOUT.DEFAULT}
                        form={
                            props.hasSection ? props.form[field.name] : props.form[SECTION_LAYOUT.DEFAULT][field.name]
                        }
                        sync={sync}
                    />
                ))}
            </div>
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

export default DefaultForm;