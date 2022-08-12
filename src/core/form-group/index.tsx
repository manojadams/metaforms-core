import React, {Fragment, useContext} from 'react';
import BSFormGroup from './bs-form-group';
import FormContext from '../form-context';
import { IField } from '../../constants/model-interfaces';
import BaseFormGroup from './base-form-group';

function FormGroup(props: {fields: Array<IField>}) {
    const {theme, page} = useContext(FormContext);
    return (
        <BaseFormGroup {...props} />
    )
}

export default FormGroup;