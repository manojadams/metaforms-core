import React, { Fragment, useContext } from "react";
import FormContext from "../form-context";
import { IField } from "../../constants/model-interfaces";

function FormGroup(props: { fields: Array<IField> }) {
    const { IBaseFormGroup } = useContext(FormContext);
    return <IBaseFormGroup {...props} />;
}

export default FormGroup;
