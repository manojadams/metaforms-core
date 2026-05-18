import React, { useContext } from "react";
import FormImplsContext from "../form-impl-context";
import { IField } from "../../constants/model-interfaces";

function FormGroupRenderer(props: { fields: Array<IField> }) {
    const formImplContext = useContext(FormImplsContext);
    if (!formImplContext) return null;
    const { IBaseFormGroup } = formImplContext;
    return <IBaseFormGroup {...props} />;
}

export default FormGroupRenderer;
