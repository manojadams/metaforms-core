import React, { Fragment, useContext, useState } from "react";
import FormUtils from "../utils/FormUtil";
import { IFormField, IRenderField } from "../constants/common-interface";
import { Row as MRow } from "layout-emotions";
import Row from "./layout/Row";
import FormControl from "./form-controls/FormControl";
import { IField } from "../constants/model-interfaces";
import Col from "./layout/Col";
import styled from "@emotion/styled";
import FormContext from "./form-context";

function FormFieldRenderer(props: IRenderField) {
    const { formConfig } = useContext(FormContext);
    if (props?.meta?.type === "hidden") {
        return <Fragment />;
    }
    const isStandalone = props?.meta?.displayProps?.isStandalone || false;
    const isSection = props?.meta?.type === "section";
    const cssClassName = FormUtils.getCssClassName(props.meta.displayProps);
    const [cField, setCField] = useState(props.form);
    const sync = () => {
        if (props.meta.type === "section") {
            setCField({ ...props.form });
        }
        props.sync();
    };
    if (cField && cField.display === false) {
        return <Fragment />;
    }
    if (isSection) {
        return (
            <MRow 
                gapX={formConfig.config?.gapX} 
                gapY={formConfig.config?.gapY}
            >
                <RenderColumn
                    cssClassName={cssClassName}
                    props={props}
                    isStandAlone={isStandalone}
                    isSection={isSection}
                    sync={sync}
                    cField={cField}
                />
            </MRow>
        );
    } else if (isStandalone) {
        return (
            <div className="mcol-md-12 my-0">
                <RenderColumn
                    cssClassName={cssClassName}
                    props={props}
                    isStandAlone={isStandalone}
                    isSection={isSection}
                    sync={sync}
                    cField={cField}
                />
            </div>
        );
    } else {
        return (
            <RenderColumn
                cssClassName={cssClassName}
                props={props}
                isStandAlone={isStandalone}
                isSection={false}
                sync={sync}
                cField={cField}
            />
        );
    }
}

export default FormFieldRenderer;

function RenderColumn({
    cssClassName,
    props,
    isStandAlone,
    isSection,
    cField,
    sync
}: {
    cssClassName: string;
    props: IRenderField;
    isStandAlone: boolean;
    isSection: boolean;
    cField: IFormField;
    sync: () => void;
}) {
    const type = props.meta?.type ? props.meta.type : "field";
    const wrapClassName = cssClassName || (type === "field" ? "mcol-md-12" : "");
    if (wrapClassName) {
        return (
            <Row isStandalone={isStandAlone} align={props?.meta?.displayProps?.align}>
                {props.meta.displayProps?.rs && <div className="mcol-md-12" />}
                <div className={wrapClassName}>
                    {isSection && props.meta.displayType === "title" && (
                        <h4 className="text-center mt-md-5 mb-md-2 mt-4 mb-2">{props.meta.displayName}</h4>
                    )}
                    {!isSection && <FormControl props={props} cField={cField} sync={sync} />}
                    {props.fields &&
                        props.fields.map((field: IField) => (
                            <FormFieldRenderer
                                {...field}
                                key={field.name}
                                section={props.section}
                                form={props.form[field.name]}
                                sync={sync}
                            />
                    ))}
                </div>
            </Row>
        );
    } else {
        return (
            <Fragment>
                {isSection && props.meta.displayType === "title" && (
                    <Col type="12">
                        <H4>{props.meta.displayName}</H4>
                    </Col>
                )}
                {!isSection && <FormControl props={props} cField={cField} sync={sync} />}
                {props.fields &&
                    props.fields.map((field: IField) => (
                        <FormFieldRenderer
                            {...field}
                            key={field.name}
                            section={props.name}
                            form={props.form[field.name]}
                            sync={sync}
                        />
                    ))}
            </Fragment>
        );
    }
}

const H4 = styled.h4`
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
`;
