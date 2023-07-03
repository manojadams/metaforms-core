import { SyntheticEvent } from "react";
import BaseFormControl from "../form/form-controls/BaseFormControl";
import BaseFormGroup from "../form/form-group/BaseFormGroup";
import BaseFormStepper from "../form/form-stepper/BaseFormStepper";
import {
    IEvent,
    IField,
    IFormatterType,
    IMeta,
    IOption,
    IRest,
    ITheme,
    IUISchema,
    IValidation,
    TParam
} from "./model-interfaces";
import { TNextCondition, TNextResponseMode, TOperator, TValue } from "./types";
import BaseFormWizard from "../form/form-wizard/BaseFormWizard";

export interface IBasicFormControl {
    date: () => Element;
    text: () => Element;
    radio: () => Element;
    select: () => Element;
}

export interface IFnTypes {
    [key: string]: (arg: TValue, ref?: IOption) => TValue;
}

export interface IElementTypes {
    [key: string]: JSX.Element;
}

export interface IFormData {
    [key: string]: string | number | boolean | IFormData | Array<string | number | File>;
}

export interface IError {
    hasError: boolean;
    errorMsg: string;
}

export interface IRestConfig {
    type?: string;
    url?: string;
    queryParams?: Array<TParam>;
    responseKey?: string;
}

export interface IFieldConfig {
    type?: string;
    labelKey?: string;
    valueKey?: string;
    responseKey?: string;
    queryParams?: Array<TParam>;
    url?: string;
    urlType?: string;
    loadOn?: string | Array<string>;
    // date config
    inputFormat?: string;
    views?: Array<string>;
    openTo?: Array<string>;

    // autocomplete
    autocomplete?: any;
    // file input
    accept?: string;
    // template
    template?: string;
}

export interface IFormField {
    prop?: string;

    className?: string;
    config?: IFieldConfig;
    events?: IEvent;
    error: IError; // internal

    display: boolean; // internal
    displayName?: string;
    displayType?: string;
    type?: string;
    value: TValue;

    isDisabled?: boolean;
    isReadonly?: boolean;
    options?: Array<IOption>;
    validation?: IValidation;
}

export interface IRenderField extends IField {
    section: string;
    form: IFormField;
    sync: () => void;
}

export interface IForm {
    [key: string]: IFormField | object;
}

export interface IFieldChange {
    section: string;
    field: string;
    value: TValue;
}

export interface IFormRenderer extends IUISchema {
    baseFormControl?: typeof BaseFormControl;
    baseFormGroup?: typeof BaseFormGroup;
    baseFormStepper?: typeof BaseFormStepper;
    baseFormWizard?: typeof BaseFormWizard;

    buttons?: IElementTypes;
    className?: string;
    controls?: IElementTypes;
    fns?: IFnTypes;
    formatter?: IFormatterType;
    icons?: IElementTypes;
    lastPageNumber?: number;
    name?: string;
    nextResponseMode?: TNextResponseMode;
    pageNumber?: number;
    useNextResponse?: boolean;

    /**
     * REST API configruation params in the form
     */
    rest?: IRest;
    /**
     * Theme information in the form
     */
    theme?: ITheme;

    onChange?: (change: IFieldChange) => void;
    onCustom?: (formData: IFormData, e: SyntheticEvent) => void;
    onError?: () => void;
    onPopupClose?: (params: Array<unknown>) => void;
    onPrevious?: (formData: IFormData, pageNumber: number) => void;
    onNext?: (formData: IFormData, pageNumber: number) => void;
    onSubmit: (formData: IFormData, params: unknown) => void;
}

export type TComponent<T> = (props: T) => JSX.Element;

export interface ISectionError {
    hasError: boolean;
    section: string;
}

export interface IOperand {
    ref: string;
    section?: string;
}

export type TCondition = [IOperand, TOperator, IOperand | TValue, TNextCondition?];

export const TVALUE_MAP_TYPE_REF = {
    fieldValue: "fieldValue",
    fieldProp: "fieldProp"
};

export interface IValueMapRef {
    type?: "fieldValue" | "fieldProp";
    ref: string;
    section?: string;
    propName?: string;
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
    valueMap: Record<string, TValue | Array<IOption> | IValueMapRef>;
    queryParams: Array<TParam>;
    pathParams: Array<TParam>;
    field: string;
    url: string;
    urlType: string;
    currentValue: TValue;
    resetValue: TValue;
    pattern: string;
    propValue: TValue;
    propName: string;
}

export interface IEventPayload {
    payload: string | number | IFieldChange;
}

export interface IMetaForm {
    theme: ITheme;
    form: IForm;
}

export interface IFieldRef {
    ref?: string;
}

export type TFieldRef = string | IFieldRef;

export type TErrorCallback = (error: Error, section: string, field: string) => void;

interface IEventDetail {
    eventType: string;
}

export class MetaformEvent extends Event {
    detail: IEventDetail;
}
