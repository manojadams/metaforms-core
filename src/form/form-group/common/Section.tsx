import React, { useState } from "react";
import { IForm } from "../../../constants/common-interface";
import { SECTION_LAYOUT } from "../../../constants/constants";
import { IField } from "../../../constants/model-interfaces";
import { Row } from "layout-emotions";
import FormFieldRenderer from "../../FormFieldRenderer";

interface ISectionProps {
    section: IField;
    index: number;
    form: IForm;
    activeIndex: number;
    error: boolean;
}

export function Section(props: ISectionProps) {
    const form2 = props.form[props.section.name ? props.section.name : SECTION_LAYOUT.DEFAULT];
    const [cField, setcField] = useState(form2);
    const sync = () => {
        if (props.section.meta && props.section.meta.type === "section") {
            setcField({ ...form2 });
        }
    };
    return (
        <div
            className={props.activeIndex === props.index ? "tab-pane active" : "tab-pane"}
            id={props.section.name}
            role="tabpanel"
            aria-labelledby="contact-tab"
        >
            <Row>
                {props.section.fields &&
                    props.section.fields.map((field: IField) => (
                        <FormFieldRenderer
                            {...field}
                            key={field.name}
                            section={props.section.name}
                            sync={sync}
                            form={cField[field.name]}
                        />
                    ))}
            </Row>
        </div>
    );
}
