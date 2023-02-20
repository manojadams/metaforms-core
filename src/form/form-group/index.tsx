import React, { useContext } from "react";
import FormImplsContext from "../form-impl-context";
import { IField } from "../../constants/model-interfaces";

function FormGroup(props: { fields: Array<IField> }) {
    const { IBaseFormGroup } = useContext(FormImplsContext);
    return <IBaseFormGroup {...props} />;
}

export default FormGroup;
