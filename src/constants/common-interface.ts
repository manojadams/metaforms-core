import { IField, IFormatterType, IMeta, IMUITheme, IOption, ITheme, IUISchema, IValidation, TParam } from "./model-interfaces";

export interface IBasicFormControl {
    date: () => Element;
    text: () => Element;
    radio: () => Element;
    select: () => Element;
}

export interface IRenderField extends IField {
    section: string;
    form: IMeta;
    sync: Function;
}

export interface IFormRenderer extends IUISchema {
    onError?: Function;
    onPrevious?: Function;
    onNext?: Function;
    onSubmit: Function;
    formatter?: IFormatterType;
    buttons?: IElementTypes;
    icons?: IElementTypes;
    pageNumber?: number;
    lastPageNumber?: number;
    className?: string;
    fns?: IFnTypes;
}

export interface IElementTypes {
    [key: string]: JSX.Element;
}

export interface IFnTypes {
    [key: string]: Function
}

export interface IMetaForm {
    theme: ITheme;
    form: any;
}

export interface IError {
    hasError: boolean;
    errorMsg: string;
}

export interface ISectionError {
    hasError: boolean;
    section: string;
}


export interface IForm {
    [key: string]: IFormField | {};
}

export interface IFormField {
    prop: string | undefined;
    display: boolean; 
    type: string | undefined;
    value: any;
    isDisabled: boolean | undefined;
    isReadonly: boolean | undefined;
    displayName: string | undefined;
    displayType: string | undefined;
    options:  Array<IOption>| undefined;
    isArray: boolean | undefined;
    url: string | undefined;
    validation: IValidation;
    mui: any;
    bootstrap: any;
    className: string;
    events: any;
    error: IError;
}

export interface IDepdendencyItem {
    ref?: string;
    section: string; 
    type: string;
    changeType: string;
    value: string;
    responseKey: string;
    labelKey: string;
    valueKey: string; 
    valueMap: Array<any>;
    queryParams: Array<TParam>;
    pathParams: Array<TParam>;
    field: string;
    url: string;
    currentValue: any;
    resetValue: any;
    pattern: string
}

export interface IEventPayload {
    value?: number;
}