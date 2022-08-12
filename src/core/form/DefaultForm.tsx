import React, {useState, useRef} from 'react';
import { IElementTypes } from '../../constants/common-interface';
import { IField, ISchema, ITheme } from '../../constants/model-interfaces';
import Submit from '../form-controls/Submit';
import FormFieldRenderer from '../form-field-renderer';

const DefaultForm = (props: IProps) => {
    const [fields, setFields] = useState(props.schema.fields);
    const sync = () => {
        setFields([...fields]);
    }
    return (
        <form className={`needs-validation ${props.validated ? 'was-validated' : ''}`} noValidate>
            <div className='row'>
            {
                props.schema.fields.map((field: IField) => <FormFieldRenderer {...field} key={field.name} section='default'
                    form={props.hasSection ? props.form[field.name] : props.form['default'][field.name]} sync={sync} />)
            }
            </div>
            <Submit theme={props.theme.type}
                form={props.form}
                buttons={props.buttons}
                formButtons={props.formButtons}
                onSubmit={props.handleSubmit}
                onReset={props.handleReset}
                onNext={props.handleNext}
                onPrevious={props.handlePrevious}
            />
        </form>
    )
}

interface IProps {
    schema: ISchema;
    validated: boolean;
    form: any;
    formButtons: Array<IField>;
    buttons?: IElementTypes;
    theme: ITheme;
    hasSection: boolean;
    handleSubmit: (e: any, field: IField) => void;
    handleReset: (e: any, field: IField) => void;
    handleNext: (e: any, field: IField, callback: any) => void;
    handlePrevious: () => void;
}

export default DefaultForm;