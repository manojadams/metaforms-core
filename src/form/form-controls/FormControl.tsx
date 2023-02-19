import React, { useContext, useState } from "react";
import { IField } from "../../constants/model-interfaces";
import FormUtils from "../../utils/FormUtil";
import { FormImplsContext } from "../form-context";

function FormControlType(props: any) {
    const [f, set] = useState<Array<IField>>([]);
    const { IBaseFormControl } = useContext(FormImplsContext);
    const type = props.props?.meta?.type ? props.props.meta.type : "";
    const add = (e: any) => {
        const field = { name: "", meta: {}, fields: props.props.fields };
        f.push(field);
        set([...f]);
        e.preventDefault();
    };
    const remove = (e: any, index: number) => {
        e.preventDefault();
        f.splice(index, 1);
        set([...f]);
    };
    const vs = FormUtils.getVerticalSpacing(props.theme);
    return <IBaseFormControl {...props.props} sync={props.sync} />;
}

export default FormControlType;
