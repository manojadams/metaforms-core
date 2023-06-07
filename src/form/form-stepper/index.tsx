import React, { useContext } from "react";
import FormImplsContext from "../form-impl-context";
import { IField } from "../../constants/model-interfaces";

function FormGroupStepper(props: { fields: Array<IField>; theme?: string }) {
    const { IBaseFormStepper } = useContext(FormImplsContext);
    return <IBaseFormStepper {...props} theme={props.theme || ""} />;
}

export default FormGroupStepper;
