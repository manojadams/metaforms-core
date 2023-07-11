import React, { useContext } from "react";
import { IFormField, IRenderField } from "../../constants/common-interface";
import FormImplsContext from "../form-impl-context";

interface IProps {
    cField: IFormField;
    props: IRenderField;
    sync: () => void;
}
function FormControl(props: IProps) {
    const { IBaseFormControl } = useContext(FormImplsContext);
    return <IBaseFormControl {...props.props} sync={props.sync} />;
}

export default FormControl;
