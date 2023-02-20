import {
    IField,
    IFormatterType,
    IMeta,
    IOption,
    ITheme,
    IUISchema,
    IURLLoaderConfig,
    IValidation,
    TParam
} from "./model-interfaces";
import { TNextCondition, TOperator, TValue } from "./types";

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
    baseFormControl?: Function;
    baseFormGroup?: Function;
    baseFormStepper?: Function;
    onChange?: Function;
    onCustom?: Function;
    onError?: Function;
    onPopupClose?: Function;
    onPrevious?: Function;
    onNext?: Function;
    onSubmit: Function;
    name?: string;
    nextResponseMode?: TNextResponseMode;
    useNextResponse?: boolean;
    formatter?: IFormatterType;
    controls?: IElementTypes;
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

export type TComponent = (props: any) => JSX.Element;

export interface IFnTypes {
    [key: string]: Function;
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
    value: TValue;
    isDisabled: boolean | undefined;
    isReadonly: boolean | undefined;
    displayName: string | undefined;
    displayType: string | undefined;
    options: Array<IOption> | undefined;
    isArray: boolean | undefined;
    url: string | undefined;
    validation: IValidation;
    mui: any;
    bootstrap: any;
    className: string;
    config: any;
    events: any;
    error: IError;
}

export interface IDepdendencyItem {
    ref?: string;
    section: string;
    type: string;
    condition?: Array<TCondition>;
    changeType: string;
    defaultValue?: string;
    value: string;
    responseKey: string;
    labelKey: string;
    valueFn?: string; // function name to be called to evaluated
    valueKey: string;
    valueMap: Array<any>;
    queryParams: Array<TParam>;
    pathParams: Array<TParam>;
    field: string;
    url: string;
    urlType: string;
    currentValue: any;
    resetValue: any;
    pattern: string;

    propValue: any;
    propName: string;
}

export interface IEventPayload {
    value?: number;
}

export interface IModalPayload {
    config: IURLLoaderConfig | undefined;
    field: string;
    label: string;
    options: Array<IOption>;
    value: string;
    section: string;
    valueCallback: Function;
}

export type TNextResponseMode = "form-data" | "page-data";

export type TCondition = [IOperand, TOperator, IOperand | TValue, TNextCondition?];

export interface IOperand {
    ref: string;
    section?: string;
}
