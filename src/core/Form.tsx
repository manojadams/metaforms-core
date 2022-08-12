import React, { SyntheticEvent } from 'react';
import { IElementTypes } from '../constants/common-interface';
import { IField, ISchema, ITheme } from "../constants/model-interfaces";
import FormUtils from "../utils/FormUtil";
import DefaultForm from './form/DefaultForm';
import SectionForm from './form/SectionForm';

export default function (props: IProps) {
    const hasSection = FormUtils.hasSections(props.schema.fields);
    const sectionLayout = props.theme.sectionLayout;
    const formButtons = props.schema.buttons && props.schema.buttons.length > 0
        ? props.schema.buttons : FormUtils.getFormDefaultButtons();

    const handleSubmit = (e: any, field: IField) => {
        if (props.validate(e,'submit')) {
            if (props.onSubmit) {
                const data = props.form;
                props.onSubmit(e, data);
            }
        }
        props.formValidated(true);
    }
    const handleReset = (e: any, field: IField) => {
        // to do
    }
    const handleNext = (e: SyntheticEvent, section: IField, callback: any) => {
        if (props.validate(e, 'next')) {
            props.emit('switch', {payload:'next',callback});
            props.onNext();

        } else {
            props.emit('validation_error', {payload:section.name});
        }
    }
    const handlePrevious = () => {
        props.emit('switch', {payload:'previous'});
        props.onPrevious();
    }
    if (hasSection && sectionLayout !== 'default') {
        return (<SectionForm {...props} 
            formButtons={formButtons} 
            hasSection={hasSection}
            handleSubmit={handleSubmit} 
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleReset={handleReset}
        />)
    } else {
        return (<DefaultForm {...props} 
            formButtons={formButtons} 
            hasSection={hasSection}
            handleSubmit={handleSubmit} 
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleReset={handleReset}
        />)
    }
}

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: any;
    theme: ITheme;
    onPrevious: Function;
    onNext: Function;
    onSubmit: Function;
    emit: Function;
    buttons?: IElementTypes;
    validate: (e: SyntheticEvent, type: string) => boolean;
    formValidated: (validated: boolean) => void;
}