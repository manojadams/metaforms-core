import { SyntheticEvent } from "react";
import BaseFormControl from "../form/form-controls/BaseFormControl";
import BaseFormGroup from "../form/form-group/BaseFormGroup";
import BaseFormStepper from "../form/form-stepper/BaseFormStepper";
import {
    IDisplayProps,
    IEvent,
    IField,
    IFieldError,
    IFormConfig,
    IFormatterType,
    IIconConfig,
    IOption,
    IRest,
    IThemeConfig,
    IUISchema,
    IValidation,
    IconConfig,
    TParam,
    TParamType
} from "./model-interfaces";
import { TChangeMode, TFormType, TNextCondition, TNextResponseMode, TOperator, TSectionLayout, TValue } from "./types";
import BaseFormWizard from "../form/form-wizard/BaseFormWizard";

export interface IBasicFormControl {
    date: () => Element;
    text: () => Element;
    radio: () => Element;
    select: () => Element;
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

export interface IRequestBody {
    [key: string]: TValue | IRequestBody;
}

export interface IApiConfig {
    // http request type - GET, POST, PUT, DELETE
    requestType?: string;
    // request body payload
    requestBody?: IRequestBody;
    // requst body payload parameters
    requestBodyParams?: Array<TParamType>;
    // request header parameter
    requestHeaders?: Record<string, string>;
    // query parameters
    queryParams?: Array<TParam>;
    // url of the api
    url?: string;
    // to setup url location type (local, remote)
    urlType?: string;
    labelKey?: string;
    valueKey?: string;
    responseKey?: string;
}

export interface IFieldConfig extends IApiConfig {
    type?: string;
    loadOn?: string | Array<string>;
    // load data lazily
    lazy?: boolean;
    // allow multiple values, e.g-> checkbox, multi-select
    multiple?: boolean;
    // date config
    inputFormat?: string;
    views?: Array<string>;
    openTo?: Array<string>;

    // autocomplete
    autocomplete?: any;

    // file input
    accept?: string;
    blob?: boolean;

    // template
    template?: string;
}

export interface IFormField {
    prop?: string | null;

    className?: string;
    config?: IFieldConfig | Record<string, unknown>;
    events?: IEvent;
    error: IError; // internal

    display: boolean; // internal
    displayName?: string;
    displayProps?: IDisplayProps;
    htmlProps?: Record<string, string>;
    displayType?: string;
    type?: string;
    value: Exclude<TValue, Date>;
    placeholder?: string;

    isDisabled?: boolean;
    isReadonly?: boolean;
    options?: Array<IOption>;
    file?: File; // for file type
    files?: Array<File>; // for file type
    validation?: IValidation;

    /** @deprecated */
    icons?: IIconConfig;
    iconName?: string; // icon name
    icon?: IconConfig; // icon config

    isArray?: boolean;
}

export interface IFnTypes {
    [key: string]: (arg: TValue, ref?: IOption, formField?: IFormField) => TValue | IOption[];
}

export interface IRenderField extends IField {
    section: string;
    form: IFormField;
    sync: () => void;
}

export interface IFormSection {
    [key: string]: IFormField;
}
export interface IForm {
    [key: string]: IFormSection;
}
export interface IFieldChange {
    section: string;
    field: string;
    value: TValue;
}

export interface IControlProps {
    field: IFormField;
    form: IForm;
}

export type TFormResponse = Promise<void> | Promise<boolean> | void;

export interface IEventPayload {
    payload: string | number | IFieldChange;
}

export interface IFormRenderer extends IUISchema, IFormConfig {
    baseFormControl?: typeof BaseFormControl;
    baseFormGroup?: typeof BaseFormGroup;
    baseFormStepper?: typeof BaseFormStepper;
    baseFormWizard?: typeof BaseFormWizard;
    loader?: JSX.Element;

    /**
     * Basic inputs params
     */
    /** Form class */
    className?: string;
    /** Input form data in key, value object format */
    data?: IFormData;
    /** Form class */
    type?: TFormType;
    /** Section layout */
    sectionLayout?: TSectionLayout;
    /** Field layout - row | column (default) */
    fieldLayout?: "row" | "column" | string;
    /** Spacing around the field */
    spacing?: string;

    /** theme configuration input params */
    themeConfig?: IThemeConfig;

    /**
     * Customization params
     */
    buttons?: IElementTypes;
    controls?: IElementTypes;
    components?: Record<string, React.FunctionComponent<IControlProps>>;
    fns?: IFnTypes;
    formatter?: IFormatterType;
    icons?: IElementTypes;
    lastPageNumber?: number;
    name?: string;
    nextResponseMode?: TNextResponseMode;
    /** */
    changeResponseMode?: TChangeMode;
    pageNumber?: number;

    /**
     * REST API configruation params in the form
     */
    rest?: IRest;

    /**
     * Event handling params
     */
    onChange?: (change: IFieldChange, formData?: IFormData) => void;
    onCustom?: (formData: IFormData, e: SyntheticEvent) => TFormResponse;
    onError?: (errorResponse: any) => TFormResponse;
    onPopupClose?: (params: Array<unknown>) => void;
    onPrevious?: (formData: IFormData, pageNumber: number) => TFormResponse;
    onNext?: (
        formData: IFormData,
        pageNumber: number,
        setErrors: (errors: IFieldError | Array<IFieldError>) => void
    ) => TFormResponse;
    onSubmit: (
        formData: IFormData,
        pageNumber: number,
        setErrors: (errors: IFieldError | Array<IFieldError>) => void
    ) => TFormResponse;
    onSubmitError?: (params: IEventPayload) => void;
    setLoading?: (isLoading: boolean) => void;
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

export interface IDepdendencyItem extends IApiConfig {
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

export interface IMetaForm {
    formConfig: IFormConfig;
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
