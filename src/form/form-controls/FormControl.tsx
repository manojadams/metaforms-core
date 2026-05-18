import React, { useContext } from "react";
import { IFormField, IRenderField } from "../../constants/common-interface";
import FormImplsContext from "../form-impl-context";

interface IProps {
    cField: IFormField;
    props: IRenderField;
    sync: () => void;
}
function FormControl(props: IProps) {
    const formImplContext = useContext(FormImplsContext);
    if (!formImplContext) return null;
    const { IBaseFormControl } = formImplContext;
    return <IBaseFormControl {...props.props} sync={props.sync} />;
}

export default FormControl;
