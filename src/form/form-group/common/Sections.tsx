import React, { useContext } from "react";
import { IField } from "../../../constants/model-interfaces";
import { ISectionError } from "../../../constants/common-interface";
import FormContext from "./../../form-context";
import FormUtils from "../../../utils/FormUtil";
import { Section } from "./Section";

function Sections(props: IProps) {
    const { theme, form } = useContext(FormContext);
    const sections = props.sections;
    const padding = FormUtils.getPadding(theme.type);
    return (
        <div className={"tab-content " + padding} id="tab-content">
            {sections.map((section, index) => (
                <Section
                    key={section.name}
                    section={section}
                    index={index}
                    error={props?.error?.section === section.name}
                    form={form}
                    activeIndex={props.activeIndex}
                />
            ))}
        </div>
    );
}

interface IProps {
    sections: Array<IField>;
    activeIndex: number;
    error: ISectionError;
}

export default Sections;
