import React, {Fragment, useContext, useEffect, useState} from 'react';
import { IField } from '../../constants/model-interfaces';
import FormUtils from '../../utils/FormUtil';
import BaseFormControl from './base-form-control';

function FormControlType(props: any) {
    const [f, set] = useState<Array<IField>>([]);
    const type = props.props?.meta?.type ? props.props.meta.type : '';
    const add = (e: any) => {
        const field = {name: '',meta:{}, fields: props.props.fields};
        f.push(field);
        set([...f]);
        e.preventDefault();
    }
    const remove = (e: any, index: number) => {
        e.preventDefault();
        f.splice(index,1);
        set([...f]);
    }
    const vs = FormUtils.getVerticalSpacing(props.theme);
    return (<BaseFormControl {...props}/>)
}

// export function FormControl({theme, props, cField, sync}:{theme: string, props: IRenderField, cField: any, sync: Function}) {
//     switch (theme) {
//         case 'mui':
//             return (
//                 <MuiFormControl {...props} sync={sync}/>
//             );
//         case 'bootstrap':
//         default:
//             return (
//                 <BSFormControl {...props} sync={sync}/>
//             )
//     }
// }

export default FormControlType;