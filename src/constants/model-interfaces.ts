import { IFieldConfig, TCondition, TFieldRef } from "./common-interface";
import { TFormType, TSectionLayout, TValue } from "./types";

export interface IParamType {
    type?: string;
    ref?: string; // reference field
    section?: string; // reference section
}

export type TParamType = IParamType | TValue;
export type TParam = [string, TParamType];

/**
 * Display/layout properties of the field
 */
export interface IDisplayProps {
    /** For large devices */
    lg?: number;
    /** For medium devices */
    md?: number;
    /** For small devices */
    sm?: number;
    /** For very small devices */
    xs?: number;
    /** Offset distance from row start */
    offset?: string;
    /** Wheter to start field from a new row position */
    rs?: boolean; // row start
    isStandalone?: boolean;
    /** Field alignment */
    align?: string; // left, right, center
    /** Layout inside field */
    fieldLayout?: string;
    /** Layout for dropdown options */
    optionsLayout?: string;
}

export interface IMultitextInput {
    chars: string;
    width: string;
    isReadonly?: boolean;
    required?: boolean;
    placeholder?: string;
    value?: string;
}

/**
 * Represents a dropdown option
 */
export interface IOption {
    value: TValue;
    label: string;
    ref?: TFieldRef; // reference to original object
}

export interface IValidationDetail {
    errorMsg?: string;
}

export interface IInfoDetail {
    infoMsg?: string;
    infoMsgFn?: string;
}

export interface IPatternValidationDetail extends IValidationDetail {
    allowValidOnly?: boolean;
}

/**
 * Validation properties for field
 */
export interface IValidation {
    /** Marks the field as mandatory before form submission */
    required?: boolean;
    /** Validation details specific to required property */
    requiredDetail?: IValidationDetail;
    /** Pattern to be used by the field -- valid for field of type text */
    pattern?: string;
    /** Pattern details specific to pattern property */
    patternDetail?: IPatternValidationDetail;
    /** Minimum value acceptable by the field */
    min?: number | string;
    /** Details related to min. property */
    minDetail?: IValidationDetail;
    /** Maximum value acceptable by the field */
    max?: number | string;
    /** Details related to max. property */
    maxDetail?: IValidationDetail;
    /** Generic info related to the field */
    infoDetail?: IInfoDetail;
}

export interface IConfigParam {
    key: string;
    value: string;
}

export interface IConfig {
    type?: string;
    apihost?: string;
    basepath?: string;
    protocol?: string;
    headers?: Array<IConfigParam>;
}

/**
 * Rest configuration to be used in schema definition
 */
export interface IRest {
    config: IConfig;
}

export interface IThemeConfig {
    variant?: string;
    size?: string;
    tabs?: {
        variant: string;
    };
    gapX?: number;
    gapY?: number;
}

export interface IFormConfig {
    type?: TFormType;
    sectionLayout?: TSectionLayout;
    fieldLayout?: string;
    config?: IThemeConfig;
}

export interface ITemplateConfig {
    params: Record<string, string>;
}

export interface IURLLoaderConfig {
    type: string; // url_loader, lazy_loader, inputs
    url: string;
    urlType?: string; // for remote url
    queryParams?: Array<TParam>; // query params
    pathParams?: Array<TParam>; // path params
    responseKey?: string;
    valueKey?: string;
    labelKey?: string;
    loadOn?: Array<string>;
    openTo?: string; // for calendar -- year, month, day
    inputFormat?: string; // for calendar
    views?: string; // for calendar

    inputs?: Array<IMultitextInput>; // for inputs
    separator?: string; // for inputs

    accept?: string; // for input file
    toolbarVersion?: number; // for datepicker
}

/**
 * Configuration info of icon
 */
export interface IIconConfig {
    [key: string]: {
        type: string;
        position?: string;
    };
}

export interface IBaseDependency {
    section?: string;
    ref: string;
    value?: TValue;
}

export type IExistsDependency = IBaseDependency;

export type IEnabledDependency = IBaseDependency;

export interface ILoadDependency extends IBaseDependency {
    url: string;
}

export interface IEqualsDependency extends IBaseDependency {
    currentValue: TValue;
    resetValue?: TValue;
}

export type IDisplayTypeDependency = IBaseDependency;

// interface IFieldChange {
//     type: string;
//     reference: string;
// }

export interface IDependency {
    exists?: IExistsDependency;
    enabled?: IEnabledDependency;
    load?: ILoadDependency;
    equals?: IEqualsDependency;
    displayType?: IDisplayTypeDependency;
}

export interface IClickEvent {
    type: string; // submit, reset, next, previous, action (custom)
    value?: string;
}
export interface IInputEvent {
    type: string;
    url: string;
    params: Array<TParam>;
    labelKey?: string;
    valueKey?: string;
    responseKey?: string;
    response?: string;
    value?: string;
}

export interface IChangeEvent {
    type: string; // setter
    name?: string;
    ref?: string; // ref not mandatory for eventemitter
    valueKey?: string;
    value?: TValue;
    valueFn?: string;
    valueMap?: Record<string, TValue | IOption>;
    section?: string;
    condition?: TCondition[]; // for complex condition computation
    eventType?: string; // for emitter events
    payload?: any; // for emitter events
}

export interface IEvent {
    click?: IClickEvent;
    input?: IInputEvent;
    change?: IChangeEvent | Array<IChangeEvent>;
    open?: IFieldConfig; // for select
}

export interface IFormatterType {
    [key: string]: (arg: TValue) => string;
}

export interface IThemeFieldConfig {
    [key: string]: string;
}

export interface IMeta {
    /**
     * values - hidden (whether field is to be hidden)
     * value - section (whether field is a section)
     */
    type?: string;
    /** Is field to be displayed
     * @internal
     */
    display?: boolean;
    /** For future usage */
    isArray?: boolean;
    /** Display name of the field */
    displayName?: string;
    /** Display type of the field. */
    displayType?: string;
    /** Placeholder to be used in the field */
    placeholder?: string;
    /** Value of the field */
    value?: string | number | boolean;
    /** Layout properties of the field */
    displayProps?: IDisplayProps;
    /** Native html properties of the field */
    htmlProps?: Record<string, string>;
    /** List of options available for the field (e.g-> dropdown, select etc) */
    options?: Array<IOption>;
    /** Marks a field as `disabled` */
    isDisabled?: boolean;
    /** Marks as field as `readonly` */
    isReadonly?: boolean;
    /** Validation details for the field */
    validation?: IValidation;
    /** Field relationships/dependencies with other fields */
    dependencies?: IDependency;
    url?: string;
    /** Custom classname to be used for the field */
    className?: string;
    /** Events supported by the field */
    events?: IEvent;
    labelPlacement?: string;
    /** Validation errors with the field */
    error?: { hasError: boolean; errorMsg: string };
    /** Configuration information of the field */
    config?: IFieldConfig;
    /** Theme configuration information for the field */
    themeConfig?: IThemeFieldConfig;
    /** Init config for the field */
    /** @deprecated */
    init?: IFieldConfig;
    /** Icons used by the field */
    icons?: IIconConfig;
}

/**
 * This represents each form field in the metaform schema
 */
export interface IField {
    /**
     * The name of the field
     */
    name: string;
    /**
     * This property is used for grouping the field while submitting the form.
     * Use `null` if field has no parent key while submitting the form
     */
    prop?: string | null;
    /**
     * This property contains meta information (field details ) about the field
     */
    meta: IMeta;
    /**
     * A list of children fields
     */
    fields?: Array<IField>;
}

/**
 * The schema definition used in metaforms
 */
export interface ISchema {
    /**
     * Rest configuration
     */
    rest?: IRest;
    /**
     * List of form fields
     */
    fields: Array<IField>;
    /**
     * Button definitions in the form
     */
    buttons?: Array<IField>;
}

/**
 * The root of json schema
 * @category Main schema definition
 */
export interface IUISchema {
    schema: ISchema;
}
