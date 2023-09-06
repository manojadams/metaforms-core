import React, { useContext } from "react";
import { IField } from "../../../constants/model-interfaces";
import { ISectionError } from "../../../constants/common-interface";
import FormContext from "./../../form-context";
import { Section } from "./Section";
import styled from "@emotion/styled";

interface IProps {
    sections: Array<IField>;
    activeIndex: number;
    error: ISectionError;
}

function Sections(props: IProps) {
    const { form } = useContext(FormContext);
    const sections = props.sections;
    return (
        <TabContent id="tab-content">
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
        </TabContent>
    );
}

const TabContent = styled.div`
    padding: 0.5rem 0;
`;

export default Sections;
