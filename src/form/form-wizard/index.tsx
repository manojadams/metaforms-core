import React, { useContext } from "react";
import FormImplsContext from "../form-impl-context";
import { IField } from "../../constants/model-interfaces";

function FormGroupWizard(props: { fields: Array<IField>; theme?: string }) {
    const { IBaseFormWizard } = useContext(FormImplsContext);
    return <IBaseFormWizard {...props} theme={props.theme || ""} />;
}

export default FormGroupWizard;
