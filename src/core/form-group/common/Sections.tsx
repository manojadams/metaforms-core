import React, { useContext, useEffect, useState } from "react";
import { IField, ITheme } from "../../../constants/model-interfaces";
import { IError, ISectionError } from "../../../constants/common-interface";
import FormContext from "./../../form-context";
import FormFieldRenderer from "../../form-field-renderer";
import FormUtils from "../../../utils/FormUtil";

function Sections(props: IProps) {
    const {theme, form} = useContext(FormContext);
    const sections = props.sections;
    const padding = FormUtils.getPadding(theme.type);
    return (
        <div className={'tab-content '+padding} id="myTabContent">
            {
                sections.map((section,index)=><Section 
                    key={section.name} 
                    section={section} 
                    index={index}
                    error={props?.error?.section === section.name}
                    form={form} activeIndex={props.activeIndex}/>)
            }
        </div>
    )
}

function Section(props: any) {
    const form2 = props.form[props.section.name?props.section.name:'default'];
    const [cField, setcField] = useState(form2);
    useEffect(() => {

    },[props.error]);
    const sync = () => {
        if (props.section.meta && props.section.meta.type === 'section') {
            setcField({...form2});
        }
    };
    return (
        <div className={props.activeIndex===props.index?'tab-pane active':'tab-pane'} id={props.section.name} role="tabpanel" aria-labelledby="contact-tab">
            <div className="row">
            {
                props.section.fields && props.section.fields.map((field:IField) => <FormFieldRenderer {...field} key={field.name} section={props.section.name} sync={sync} form={cField[field.name]}/>)
            }
            </div>
        </div>
    )
}
interface IProps {
    sections: Array<IField>;
    activeIndex: number;
    error: ISectionError;
}

export default Sections;