import { TValue } from "./types";

/**
 * The root of json schema 
 * @category Main schema definition
 */
export interface IUISchema {
    schema: ISchema;
}

/**
 * The schema definition used in metaforms
 */
export interface ISchema {
    /**
     * List of form fields
     */
    fields: Array<IField>;
    /**
     * Theme information in the form
     */
    theme?: ITheme;
    /**
     * Button definitions in the form
     */
    buttons?: Array<IField>;
    /**
     * REST API configruation params in the form
     */
    rest?: IRest;
}

/**
 * Rest configuration to be used in schema definition
 */
export interface IRest {
    config: IConfig;
}

export interface IConfig {
    apihost?: string;
    basepath?: string;
    protocol?: string;
    headers?: Array<IConfigParam>;
}

export interface IConfigParam {
    key: string;
    value: string;
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

export interface IMeta {
    /** */
    type?: string;
    /** Is field to be displayed */
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
    loader?: ILoader;
    mui?: any;
    bootstrap?: any;
    url?: string;
    /** Custom classname to be used for the field */
    className?: string;
    /** Events supported by the field */
    events?: IEvent;
    labelPlacement?: string;
    /** Validation errors with the field */
    error?: { hasError: boolean; errorMsg: string };
    /** Configuration information of the field */
    config?: any;
    /** Init configuration for the field */
    init?: any;
    /** Icons used by the field */
    icons?: IIconConfig;
}

/**
 * Represents a dropdown option
 */
export interface IOption {
    value: TValue;
    label: string;
    ref?: any; // reference to original object
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
    /** Wheter to start field from a new row position*/
    rs?: boolean; // row start
    isStandalone?: boolean;
    /** Field alignment */
    align?: string; // left, right, center
    /** Layout inside field */
    fieldLayout?: string;
    /** Layout for dropdown options*/
    optionsLayout?: string;
}

/**
 * Theme info related to field
 */
export interface ITheme {
    /** Type of theme */
    type: string;
    /** Section layout */
    sectionLayout?: string;
    /** Spacing around the field*/
    spacing?: string;
    /** Global classname to be used */
    className?: string;
    /** Theme props specific to mui */
    mui?: IMUITheme;
    /** Theme props specific to bootstrap */
    bootstrap?: IBootstrapTheme;
}

/**
 * Validation properties for field
 */
export interface IValidation {
    /** Marks the field as mandatory before form submission*/
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

export interface IValidationDetail {
    errorMsg?: string;
}

export interface IPatternValidationDetail extends IValidationDetail {
    allowValidOnly?: boolean;
}

export interface IInfoDetail {
    infoMsg?: string;
    infoMsgFn?: string;
}

export interface IDependency {
    exists?: IExistsDependency;
    enabled?: IEnabledDependency;
    load?: ILoadDependency;
    equals?: IEqualsDependency;
    displayType?: IDisplayTypeDependency;
}

export interface IBaseDependency {
    section?: string;
    ref: string;
    value?: TValue;
}

export interface IExistsDependency extends IBaseDependency {
    // to be added later
}

export interface IEnabledDependency extends IBaseDependency {
    // to be added later
}

export interface ILoadDependency extends IBaseDependency {
    url: string;
}

export interface IEqualsDependency extends IBaseDependency {
    currentValue: any;
    resetValue?: any;
}

export interface IDisplayTypeDependency extends IBaseDependency {
    // to be added later
}

export interface ILoader {
    // to be added later
}

export interface IFieldChange {
    type: string;
    reference: string;
}

export interface IEvent {
    click?: IClickEvent;
    input?: IInputEvent;
    change?: IChangeEvent | Array<IChangeEvent>;
    open?: IConfig; // for select
}

export interface IMUITheme {
    variant?: string;
    size?: string;
    tabs?: {
        variant: string;
    };
}

export interface IBootstrapTheme {}

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
    ref?: string; // ref not mandatory for eventemitter
    valueKey?: string;
    value?: TValue;
}

export interface IParamType {
    type?: string;
    ref?: string; // reference field
    section?: string; // reference section
}

export type TParamType = IParamType | string | undefined;
export type TParam = [string, TParamType];

export interface IFormatterType {
    [key: string]: Function;
}

export interface IMultitextInput {
    chars: string;
    width: string;
    isReadonly?: boolean;
    required?: boolean;
    placeholder?: string;
    value?: string;
}
