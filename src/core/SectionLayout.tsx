import React, { Fragment, useContext } from "react";
import { IField } from "../constants/model-interfaces";
import FormContext from "./form-context";
import FormGroup from "./form-group";
import FormImplsContext from "./form-impls.context";
import BSFormWizard from "./form-wizard/bs-form-wizard";


function SectionLayout(props: IProps) {
    const {theme:{type, sectionLayout}} = useContext(FormContext);
    const {IBaseFormStepper, IBaseFormGroup} = useContext(FormImplsContext);

    switch(sectionLayout) {
        case 'tabs':
            return (
                <IBaseFormGroup fields={props.fields} />
            )
        case 'wizard':
            return (
                <BSFormWizard fields={props.fields} theme={type}/>
            )
        case 'stepper':
            return (
                <IBaseFormStepper fields={props.fields} theme={type} />
            )
        default:
            // const fn = () => false;
            // const {form} = useContext(FormContext);
            // return (
            //     <Fragment>
            //         {props.fields.map((field: IField) => <FormFieldRenderer {...field} key={field.name} section='default' form={form} sync={fn}/>)}
            //     </Fragment>
            // )
    }
    return (<Fragment></Fragment>)
}

interface IProps {
    fields: Array<IField>;
    form: any;

}

export default SectionLayout;