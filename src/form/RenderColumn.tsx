import React, { Fragment, useContext } from "react";
import { IRenderField } from "../constants/common-interface";
import { IField } from "../constants/model-interfaces";
import FormUtils from "../utils/FormUtil";
import FormContext from "./form-context";
import FormFieldRenderer from "./form-field-renderer";
import Col from "./layout/Col";
import Row from "./layout/Row";

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
    cField: any;
    sync: Function;
}) {
    const { theme } = useContext(FormContext);
    const vs = FormUtils.getVerticalSpacing(theme.type);
    const type = props.meta?.type ? props.meta.type : "field";
    const wrapClassName = cssClassName || type === "field" ? "col-md-12" : "";
    if (wrapClassName) {
        return (
            <Row isStandalone={isStandAlone} align={props?.meta?.displayProps?.align}>
                {props.meta.displayProps?.rs && <div className="col-md-12" />}
                <div className={wrapClassName + " " + vs}>
                    {isSection && props.meta.displayType === "title" && (
                        <h4 className="text-center mt-md-5 mb-md-2 mt-4 mb-2">{props.meta.displayName}</h4>
                    )}
                    {!isSection && <FormControl props={props} theme={theme.type} cField={cField} sync={sync} />}
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
                        <h4 className="text-center mt-md-5 mb-md-2 mt-4 mb-2">{props.meta.displayName}</h4>
                    </Col>
                )}
                {!isSection && <FormControl props={props} theme={theme.type} cField={cField} sync={sync} />}
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

export default RenderColumn;