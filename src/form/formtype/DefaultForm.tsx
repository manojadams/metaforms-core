import React, { useContext, useState } from "react";
import { IElementTypes, IForm } from "../../constants/common-interface";
import { SECTION_LAYOUT } from "../../constants/constants";
import { IField, ISchema } from "../../constants/model-interfaces";
import { TCallback } from "../../constants/types";
import { Row } from "layout-emotions";
import FormFieldRenderer from "../FormFieldRenderer";
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

const DefaultForm = (props: IProps) => {
    const [fields, setFields] = useState(props.schema.fields);
    const formContext = useContext(FormContext);

    const hasCustomFooter = formContext.hasFooter();

    const sync = () => {
        setFields([...fields]);
    };

    return (
        <form name="metaform" className={`needs-validation ${props.validated ? "was-validated" : ""}`} noValidate>
            <Row gapX={formContext.formConfig.config?.gapX} gapY={formContext.formConfig.config?.gapY}>
                {props.schema.fields.map((field: IField) => {
                    if (props.hasSection) {
                        const subFields = Object.keys(props.form[field.name]);
                        return subFields.map((subField) => (
                            <FormFieldRenderer
                                {...field}
                                key={field.name}
                                section={SECTION_LAYOUT.DEFAULT}
                                form={props.form[field.name][subField]}
                                sync={sync}
                            />
                        ));
                    } else {
                        return (
                            <FormFieldRenderer
                                {...field}
                                key={field.name}
                                section={SECTION_LAYOUT.DEFAULT}
                                form={props.form[SECTION_LAYOUT.DEFAULT][field.name]}
                                sync={sync}
                            />
                        );
                    }
                })}
            </Row>
            {
                hasCustomFooter ? (
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
                )
            }
        </form>
    );
};

export default DefaultForm;
