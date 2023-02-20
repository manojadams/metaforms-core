import React, { useContext } from "react";
import { IRenderField } from "../../constants/common-interface";
import FormImplsContext from "../form-impl-context";

interface IProps {
    cField: any;
    props: IRenderField;
    theme: any;
    sync: () => void;
}
function FormControl(props: any) {
    const { IBaseFormControl } = useContext(FormImplsContext);
    return <IBaseFormControl {...props.props} sync={props.sync} />;
}

export default FormControl;
