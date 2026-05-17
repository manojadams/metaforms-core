import React, { useContext } from "react";
import FormImplsContext from "../form-impl-context";
import { IField } from "../../constants/model-interfaces";

function FormGroupWizard(props: { fields: Array<IField>; theme?: string }) {
    const formImplContext = useContext(FormImplsContext);
    if (!formImplContext) return null;
    const { IBaseFormWizard } = formImplContext;
    return <IBaseFormWizard {...props} theme={props.theme || ""} />;
}

export default FormGroupWizard;
