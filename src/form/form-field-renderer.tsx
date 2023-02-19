import React, { Fragment, useState } from "react";
import FormUtils from "./../utils/FormUtil";
import { IRenderField } from "../constants/common-interface";
import RenderColumn from "./RenderColumn";

export default function FormFieldRenderer(props: IRenderField) {
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
    if (isStandalone || isSection) {
        const wrapClassName = isSection ? "row section" : isStandalone ? "col-md-12" : "";
        return (
            <div className={wrapClassName}>
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
