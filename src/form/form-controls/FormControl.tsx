import React, { useContext } from "react";
import { IRenderField } from "../../constants/common-interface";
import { IMeta } from "../../constants/model-interfaces";
import FormImplsContext from "../form-impl-context";

interface IProps {
    cField: IMeta;
    props: IRenderField;
    theme: string;
    sync: () => void;
}
function FormControl(props: IProps) {
    const { IBaseFormControl } = useContext(FormImplsContext);
    return <IBaseFormControl {...props.props} sync={props.sync} />;
}

export default FormControl;
